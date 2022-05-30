import React from 'react';
import Select from 'react-select';
import '../Components/Navbar.css';
import Axios from 'axios'
import axios from 'axios';

const Navbar = ({userLang, setUserLang, userTheme,
				setUserTheme, fontSize, setFontSize, importCode, setUserCode}) => {

	function share(e){
		e.preventDefault() ; 
		alert(`Your code id is ${localStorage.getItem("code_id")}`)
	}

	async function importCode(e){
		e.preventDefault() ; 
		const id = prompt("Enter Your code id") ;
		if(id===null)
		{
			return;
		}
		const res = await Axios.get(`http://localhost:8000/code/${id}`) ; 
		setUserCode(res.data) ; 
		// console.log(res.data);
	}

	async function callOcr(e){
		e.preventDefault() ; 
		alert("Image is successfully uploaded for text reading") ;

		axios.post("http://localhost:8000/ocr").then((res) => {
			console.log(res.data.data);
			setUserCode(res.data.data)
		}).catch((err) => console.log(err))
	}

	const languages = [
		{ value: "c", label: "C" },
		{ value: "cpp17", label: "C++17" },
		{ value: "cpp14", label: "C++14" },
		{ value: "python3", label: "Python3" },
		{ value: "java", label: "Java" },
		{ value: "php", label: "PHP" },
		{ value: "perl", label: "Perl" },
		{ value: "cpp17", label: "C++17" },
		{ value: "ruby", label: "Ruby" },
		{ value: "go", label: "GO Lang" },
		{ value: "sql", label: "SQL" },
		{ value: "rust", label: "RUST" },
		{ value: "r", label: "R Language" },
		{ value: "nodejs", label: "NodeJS" },
		{ value: "kotlin", label: "Kotlin" },
		{ value: "dart", label: "Dart" },
	];
	const themes = [
		{ value: "vs-dark", label: "Dark" },
		{ value: "light", label: "Light" },
	]
	return (
		<div className="navbar">
			<h1>FastIDE</h1>
			<div className='COLOR'>
			<Select options={languages} value={userLang}
					onChange={(e) => setUserLang(e.value)}
					placeholder={userLang} />
			</div>
			<div className='COLOR'>
			<Select options={themes} value={userTheme}
					onChange={(e) => setUserTheme(e.value)}
					placeholder={userTheme} />
					</div>
			<label>Font Size</label>
			<input type="range" min="18" max="30"
				value={fontSize} step="2"
				onChange={(e) => { setFontSize(e.target.value)}}/>
                <div className="importit">
			<button onClick={importCode} >
				Import shared code 
			</button>
			</div>
			<div className="shareit">
			<button style={{marginRight:"2%"}} onClick={share} >
				Share 
			</button>
			
			</div>
			<div className='uploadit'>
			<button style={{marginLeft:"2%"}} onClick={callOcr} >
					Upload 
			</button>
			</div>
		</div>
	)
}

export default Navbar
