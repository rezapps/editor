import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TxtEditor from "../components/TxtEditor";
import Nav from "../components/Nav";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Editor() {
    // const user = null;
    const url = process.env.REACT_APP_API_URL;

    const _id = useParams();
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const navigate = useNavigate();

    function saveDoc() {
        const doc = {
            title: title,
            text: text
        }

        if (_id.id === 'NEW'){
            axios.post(`${url}/api/docs/create`,doc)
            .then((res) => {
                if (res.status === 200) {
                    toast("New document saved Successfully!")
                }
            })
        } else {
            axios.patch(`${url}/api/docs/${_id.id}`, doc)
            .then((res) => {
                if (res.status === 200) {
                    toast("Document Updated Successfully!")
                }
            })
        }
    }

    function prnt() {
        const prntWindow = window.open(
          "",
          "prntWindow",
          "status=1,width=700,height=650"
        );

        const ttl = `<h1>${title}</h1>`

        prntWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        img {max-width:870px}
                        @page {
                            size: 21cm 29cm;
                            margin: 2.5cm 2cm;
                        }
                        @media print {
                            table { page-break-inside: avoid; }
                            a[href]:after {
                                content: " (" attr(href) ")";
                                font-size: 90%;
                                color: #333;
                            }

                        }

                    </style>
                </head>
            <body>${ttl + text}`);
        prntWindow.onbeforeprint = () => {
            prntWindow.history.replaceState({}, "", `./${title}`);
        }
        prntWindow.document.write('<body onafterprint="self.close()">');
        prntWindow.document.write(`</body></html>`)
        prntWindow.print();

    }



    function delDoc() {
        const id = _id.id;

        if (_id.id !== 'NEW'){
            axios.delete(`${url}/api/docs/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    toast("Document Deleted Successfully!")
                }
            })
        }
    }
    


    function cr8Doc() {
        navigate(`/editor/NEW`);
    }

    useEffect(() => {

        const currDoc = JSON.parse(localStorage.getItem('currentDoc'));

        if (currDoc && currDoc._id === _id.id) {
            setText(currDoc.text);
            setTitle(currDoc.title);

        } else {
            navigate(`/editor/NEW`);
        }
            
    }, [_id.id, navigate]);

    return (
        <main>
            {_id.id === 'NEW' ?
                <>
                    <Nav _id={_id.id} saveDoc={saveDoc} prnt={prnt} />
                    <TxtEditor 
                        placeHolder='type here...'
                        setTitle={setTitle} setText={setText}
                    />
                </>
                :
                <>
                    <Nav _id={_id.id} saveDoc={saveDoc} cr8Doc={cr8Doc} delDoc={delDoc} prnt={prnt} />
                    <TxtEditor _id={_id.id} title={title} text={text} setTitle={setTitle} setText={setText}  />
                </>
            }
            
            <ToastContainer />
        </main>
    )
}

export default Editor;
