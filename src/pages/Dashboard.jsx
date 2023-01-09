import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const url = process.env.REACT_APP_API_URL;

	const [docs, setDocs] = useState();
	const navigate = useNavigate();

	function sendToEditor(doc) {
		localStorage.setItem('currentDoc', JSON.stringify(doc));
		navigate(`/editor/${doc._id}`);
	}

	useEffect(() => {
		const allDocs = async() => {
			const response = await fetch(`${url}/api/docs`);
			const json = await response.json();

			// if response is ok then setDoc (create new doc) first then the response json
			if (response.ok) {
				setDocs([{
					_id:'NEW',
					title:'Create New',
					text:'Type here...',
					createdAt:'',
					updatedAt:''
				}, ...json])
			}
		}

		allDocs();
		// the array is dependency that force useEffect to run only once
	}, [])


	return (
		<div className='docsList'>
			<div className='docInfo docTbl' >
				<span className="docTitle">Title</span>
				<span className="docUpd8">Last opened at:</span>
				<span className="docUser">Created by:</span>
			</div>

			{ docs && docs.map(
				(doc) => (
					<div className='docInfo' key={doc._id} onClick={() => sendToEditor(doc)}>
						<span className="docTitle">{doc.title}</span>
						<span className='docUpd8'>{doc.updatedAt}</span>
						<span className='docUser'>User x</span>
					</div>
				))
			}
		</div>
	)
}

export default Dashboard
