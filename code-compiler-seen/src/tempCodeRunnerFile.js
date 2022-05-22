
	<div className="main">
		<div className="left-container">
		<Editor
			options={options}
			height="calc(100vh - 50px)"
			width="100%"
			theme={userTheme}
			language={userLang}
			defaultLanguage="python"
			defaultValue="# Enter your code here"
			value={userCode}
			onChange={(value) => { setUserCode(value) }}
		/>
		<button className="run-btn" onClick={() => compile()}>
			Run
		</button>
		</div>
		<div className="right-container">
		<h4>Input:</h4>
		<div className="input-box">
			<textarea id="code-inp" onChange=
			{(e) => setUserInput(e.target.value)}>
			</textarea>
		</div>
		<h4>Output:</h4>
		{loading ? (
			<div className="spinner-box">
			<img src={spinner} alt="Loading..." />