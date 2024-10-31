import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Dashboard from '../app/dashboard/page'


// Define Document interface
interface Document {
    _id: string
    title: string
    author: string
    updatedAt: Date
}

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}))

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

describe('Dashboard', () => {
    const mockRouter = {
        push: vi.fn()
    }

    beforeEach(() => {
        vi.resetAllMocks()
            ; (useRouter as Mock).mockReturnValue(mockRouter)
        global.fetch = vi.fn()
    })

    it('renders loading state', () => {
        ; (global.fetch as Mock).mockImplementationOnce(() => new Promise(() => { }))
        render(<Dashboard />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders error state', async () => {
        ; (global.fetch as Mock).mockRejectedValueOnce(new Error('API Error'))
        render(<Dashboard />)
        await waitFor(() => {
            expect(screen.getByText('Error fetching documents. Please try again later.')).toBeInTheDocument()
        })
    })

    it('renders documents', async () => {
        const mockDocuments: Document[] = [
            { _id: '1', title: 'Doc 1', author: 'Author 1', updatedAt: new Date('2023-01-01') },
            { _id: '2', title: 'Doc 2', author: 'Author 2', updatedAt: new Date('2023-01-02') }
        ]
            ; (global.fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockDocuments)
            })

        render(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText('Your Documents')).toBeInTheDocument()
            expect(screen.getByText('Doc 1')).toBeInTheDocument()
            expect(screen.getByText('Doc 2')).toBeInTheDocument()
        })
    })

    it('handles document deletion', async () => {
        const mockDocuments = [
            { _id: '1', title: 'Doc 1', author: 'Author 1', updatedAt: new Date('2023-01-01') }
        ]
            ; (global.fetch as Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDocuments)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Document deleted' })
                })

        render(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText('Doc 1')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Delete'))

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Document deleted successfully!', expect.any(Object))
            expect(screen.queryByText('Doc 1')).not.toBeInTheDocument()
        })
    })

    it('handles document creation', async () => {
        const mockDocuments = [
            { _id: '1', title: 'Doc 1', author: 'Author 1', updatedAt: new Date('2023-01-01') },
            { _id: '2', title: 'Doc 2', author: 'Author 2', updatedAt: new Date('2023-01-03') },
            { _id: '3', title: 'Doc 3', author: 'Author 3', updatedAt: new Date('2023-01-02') }
        ]
        const newDocId = '123'
            ; (global.fetch as Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDocuments)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ _id: newDocId })
                })

        render(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText('Create New Document')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Create New Document'))

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith(`/editor/${newDocId}`)
        })
    })

    it('sorts documents by updatedAt in descending order', async () => {
        const mockDocuments = [
            { _id: '1', title: 'Doc 1', author: 'Author 1', updatedAt: new Date('2023-01-01') },
            { _id: '2', title: 'Doc 2', author: 'Author 2', updatedAt: new Date('2023-01-03') },
            { _id: '3', title: 'Doc 3', author: 'Author 3', updatedAt: new Date('2023-01-02') }
        ]
            ; (global.fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockDocuments)
            })

        render(<Dashboard />)

        await waitFor(() => {
            const titles = screen.getAllByText(/Doc \d/)
            expect(titles[0]).toHaveTextContent('Doc 2')
            expect(titles[1]).toHaveTextContent('Doc 3')
            expect(titles[2]).toHaveTextContent('Doc 1')
        })
    })


    it('navigates to editor page when clicking on document title', async () => {
        const mockDocuments = [
            { _id: '1', title: 'Doc 1', author: 'Author 1', updatedAt: new Date('2023-01-01') }
        ]
            ; (global.fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockDocuments)
            })

        render(<Dashboard />)

        await waitFor(() => {
            const link = screen.getByText('Doc 1')
            expect(link).toHaveAttribute('href', '/editor/1')
        })
    })
})
