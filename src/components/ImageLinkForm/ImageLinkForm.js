import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {

return (

	<div>
		<p className='f3'>
			{'This Magic Brain will detect faces in your pictures. Give it a try!'}
		</p>
		<div className='center'>
			<div className=' pa4 br3 shadow-5 form center'>
				<input className='f4 pa2 w-70 center shadow-5' type='text' onChange={onInputChange}/>
				<button 
					onClick={onButtonSubmit} 
					className='w-30 grow f4 link ph3 pv2 dib white bg-red shadow-5'> 
				Detect</button>
			</div>
		</div>
	</div>
	);

}

export default ImageLinkForm;