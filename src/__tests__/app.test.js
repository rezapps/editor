import { render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import { setTitle, setText } from '../pages/Editor';
import TxtEditor from '../components/TxtEditor';
import Dashboard from '../pages/Dashboard';
import Header from '../components/Header';

afterAll(() => {
    setTimeout(() => process.exit(), 1000);
})

test('quil editor should be in the dom', () => {
    render(<TxtEditor placeHolder='type here...' setTitle={setTitle} setText={setText}/>);

    const quilEditor = screen.getByPlaceholderText('type here...');

    expect(quilEditor).toBeInTheDocument();
})


test('document list table (empty list) should be in the dom', () => {
    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );

    const docList = screen.getByText('Title');

    expect(docList).toBeInTheDocument();
})

test('header links should be visible and icons should be loaded', () => {
    render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );

    const lnks = screen.getByText('Login');

    expect(lnks).toBeInTheDocument();
})


test('dashboard should fetch and display all docs in the table', async () => {
    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    )
    let ttl = '';

    await waitFor(() => {
        ttl = screen.getByText("*** TESTING POST ENDPOINT ***");
        expect(ttl).toBeInTheDocument();
    });

})
