

//function CreateDocument({toggleShow}) {
class CreateDocument extends React.Component{    
    constructor(props){
        super(props)
        this.state = {
            document_name: this.props.document_name,
            document_lang: this.props.document_lang,
            document_tags: this.props.document_tags,
            document_data: this.props.document_data,
            document_code: this.props.document_code
        }
        
    }

    onNameChanged(e){
        this.setState({
            document_name: e.target.value
        })
        console.log(e.target.value)
    }
    onLangChanged(e){
        this.setState({
            document_lang: e.target.value
        })
        console.log(e.target.value)
    }
    save(){
        this.state.editor.save().then((outputData) => {
            
            console.log(`lang: ${this.state.document_lang} code: ${this.state.document_code} name: ${this.state.document_name}`)
            if (this.state.document_lang != '' && this.state.document_code != '' && outputData!= '' && this.state.document_name != ''){
                console.log('Article data: ', outputData)
                
                return fetch("/documents/save",{
                    method: 'PUT',
                    headers: { "Content-Type":"application/json" },
                    body: JSON.stringify({
                        document_data: outputData,
                        document_code: this.state.document_code,
                        document_title: this.state.document_name,
                        document_lang: this.state.document_lang,
                    })
                })
            }
            
        })
        .then((res)=>{return res.json()}).then((data)=>{
            console.log(data)
        })
        .catch((error) => {
            console.log('Saving failed: ', error)
        });

        
    }
    render (){
        return (
            <div>
                <div>
                    <button className="btn" onClick={this.props.toggleShow}>
                        <i className="material-icons">arrow_back</i>
                    </button>
                    <button className="btn" onClick={this.save.bind(this)}>
                        <i className="material-icons">save</i>
                    </button>
                </div>
                
                <h1>{this.props.title}</h1>
                <div className="row" style={{margin: "40px 5px"}}>
                    <div className="input-field col s4">
                        <label htmlFor="document_code">Code</label>
                        <input id="document_code" value={this.state.document_code} type="text" className="validate" onChange={(e) => this.setState({document_code: e.target.value})}/>
                        
                    </div>
                    <div className="input-field col s4">
                        <label htmlFor="document_name">Document title</label>
                        {console.log(this.state.document_name)}
                        <input id="document_name" type="text" className="validate" value={this.state.document_name} onChange={this.onNameChanged.bind(this)}/>
                        
                    </div>
                    <div className="input-field col s4">
                        <label>Document language</label>
                        <select value={this.state.document_lang}  onChange={this.onLangChanged.bind(this)}>
                            <option value="es">Spanish</option>
                            <option value="en">Enlgish</option>
                        </select>
                        
                    </div>
                </div>
                
                <div id="editor"></div>
            </div>
        )
    }
    componentDidMount() {

        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);



        const editorJSConfig = {};
        const editor = new EditorJS({
            data: this.state.document_data,
            placeholder: 'Start writing here...',
            holder:"editor",
            tools: { 
                header: Header, 
                list: List ,
                twoColumns: {
                    class: EditorJSLayout.LayoutBlockTool,
                    config: {
                      EditorJS,
                      editorJSConfig,
                      enableLayoutEditing: false,
                      enableLayoutSaving: false,
                      initialData: {
                        itemContent: {
                          1: {
                            blocks: [],
                          },
                          2: {
                            blocks: [],
                          },
                        },
                        layout: {
                          type: "container",
                          id: "",
                          className: "",
                          style:
                            "border: 1px solid #000000; display: flex; justify-content: space-around; padding: 16px; ",
                          children: [
                            {
                              type: "item",
                              id: "",
                              className: "",
                              style: "border: 1px solid #000000; padding: 8px; ",
                              itemContentId: "1",
                            },
                            {
                              type: "item",
                              id: "",
                              className: "",
                              style: "border: 1px solid #000000; padding: 8px; ",
                              itemContentId: "2",
                            },
                          ],
                        },
                      },
                    },
                    shortcut: "CMD+2",
                    toolbox: {
                      icon: `
                        <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'>
                          <rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/>
                          <path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
                        </svg>
                      `,
                      title: "2 columns",
                    },
                },
                table: Table,
                Marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M',
                  },
                delimiter: Delimiter,
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+C',
                  },
                  warning: Warning,
                  raw: RawTool,
                  code: CodeTool
            }, 
        })
        this.setState({
            editor:editor,
        })
    }
}

CreateDocument.defaultProps = {
    document_name: '',
    document_lang: 'en',
    document_tags: 'test',
    document_data: '',
    document_code: ''
  };

export default CreateDocument
