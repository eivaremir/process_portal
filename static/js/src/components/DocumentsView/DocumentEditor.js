

class DocumentEditor extends React.Component{
    
  constructor(props){
    super(props)
    this.state = {
      editor: '',
    }
  }
  async fetchDocument(document){
    return await fetch(`/documents/get/${document}`).then((res)=>{return res.json()})
    

  }
  async componentDidMount() {
    let response ;
    const editorJSConfig = {};
    const config = {
      placeholder: 'Start writing here...',
      holder:"editor",
      readOnly: this.props.readonly,
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
      }, 
      data: this.props.data
    }
    const query = getQueryParams(window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search)
    if (query.document && query.edit){
      response = await this.fetchDocument(query.document)
      config.data = response.data
      console.log(config.data)
    }
    
    
    let editor = new EditorJS(config)
  }
  
  render(){
      return (
          <div id="editor">
          
          </div>
      )
  }
}
DocumentEditor.defaultProps = {
  readonly: false,
  data: {}
};

export default DocumentEditor
