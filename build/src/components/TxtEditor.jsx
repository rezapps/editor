import ReactQuill from 'react-quill';

// const Size = Quill.import('attributors/style/size');
// Size.whitelist = ['10px', '11px', '12px', '14px', '16px', '18px','20px'];


// Quill.register(Size, true);

const TxtEditor = ({...props}) => {

	let title = ''

	const modules = {
		toolbar: [
			[{ 'font': [] }],
			[{ 'header': [1, 2, 3, 4] }],
			// [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }, { 'header': 4 }],
			[{ 'size': ['small', false, 'large', 'huge'] }],

			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],
		  
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			// [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			
			[{ 'indent': '+1' }],          // outdent/indent
			// [{ 'direction': 'rtl' }],                         // text direction			
		  
			[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			['link', 'image'],
		  
			['clean']                                         // remove formatting button
		  ]
	}

	const handleChange = (e) => {
		title = e.target.value;
		props.setTitle(title);
	}

	return (
		<>
			<div className='docTitleInput'>
				{props.placeHolder ? 
					<input
						placeholder='title here...'
						onChange={handleChange}
						required
						key={props._id}
					/>
					:
					<input
						value={props.title}
						onChange={handleChange}
						required
						key={props._id}
					/>
			
				}
			</div>

			{
				props.placeHolder ?
					<ReactQuill
						modules ={ modules }
						theme="snow"
						onChange={props.setText}
						placeholder={props.placeHolder}
					/>
				:
					<ReactQuill
						modules ={ modules  }
						theme="snow"
						value = {props.text}
						onChange={props.setText}
					/>
			}
		</>
	);
}

export default TxtEditor;
