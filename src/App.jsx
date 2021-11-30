const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}

function PostRow(props) {
  const similar = props.similar;
  return (
    <div>
      <span>Movie name: {similar.movietitle} </span>
      <br />
      <span>Language: {similar.language} </span>
      <br />
      <span>country: {similar.country} </span>
      <br />
      <span>Genre: {similar.genre} </span>
      <br />
      <span>Job Discription: {similar.JD} </span>
      <br />
      <br />
    </div>
  );
  }
  
function Posts(props) {
  const similars = props.similars.map(similar =>
    <PostRow key={similar.id} similar={similar} />
  );

  return (
    <div hidden = {props.isShow}>
      {similars}
    </div>
  );
}

function SimilarRow(props) {
  const similar = props.similar;
  return (
    <div>
      <span>Title: {similar.title} </span>
      <span>Year: {similar.year} </span>
      <br />
      <img width={400} height = {600} src={similar.image}/> 
    </div>
  );
  }
  
function Similars(props) {
  const similars = props.similars.map(similar =>
    <SimilarRow key={similar.id} similar={similar} />
  );

  return (
    <div>
      {similars}
    </div>
  );
}

function jsonDateReviver(key, value) {
  //if (dateRegex.test(value)) return new Date(value);
  return value;
}


async function graphQLFetch(query, variables = {}) {
  //console.log('graphQL')

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    //const result = body
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

function IssueRow(props) {
  const issue = props.issue;
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue.phone}</td>
      <td>{issue.created}</td>
    </tr>
  );
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );
 
  //.log('test')
  //console.log(props.issues)

  return (
    <table className="bordered-table" hidden={props.isShow}>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>PHONE</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}

class HomePage extends React.Component{
    constructor(props) {
      super(props);
      this.handleMKBClick = this.handleMKBClick.bind(this)
      this.handleBack2Homepage = this.handleBack2Homepage.bind(this)
      this.handleDisplay = this.handleDisplay.bind(this)
      this.handleModify = this.handleModify.bind(this)
      this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this)
      
      this.handleRegister = this.handleRegister.bind(this)
      this.handleLogin = this.handleLogin.bind(this)
      this.handlePost = this.handlePost.bind(this)
      this.handleShowpost = this.handleShowpost.bind(this)
      this.handleSearch = this.handleSearch.bind(this)

      
      this.createIssue = this.createIssue.bind(this);
      this.deleteIssue = this.deleteIssue.bind(this);
      this.loginsubmit = this.loginsubmit.bind(this);
      this.postjob = this.postjob.bind(this);
      this.showpost = this.showpost.bind(this);
      this.updateMovieDetail = this.updateMovieDetail.bind(this);
      
      
      this.state = {
          issues: [],
          guestlist: [],
          count:0,
          isAtHome: true,
          isAtRegister: false,
          isAtLogin: false,
          isAtPost:false,
          isAtShowpost: false,
          isAtSearch: false,

          isAtResearvation: false,
          isAtDisplay: false,
          isAtModify: false,
          availableSlots: 25,
          isSubmitSuccess: false,
          movie_detail : [],
          similars: [],
          currentuser: '',
          unique_id : 0,
          postdata: [],
      }
    }
    
    componentDidMount() {
      //console.log('ComponentDid')
      this.loadData();
    }

    updateMovieDetail = (moviedata) => {
      this.setState({movie_detail: moviedata})
      if (moviedata.hasOwnProperty('similars'))
      {
        this.setState({similars: moviedata['similars']})
      }
      
    }

    addGuest = (guestInfo) => {
      const copyGuestlist = this.state.guestlist
      copyGuestlist.push(guestInfo)
      this.setState({guestlist: copyGuestlist})
  
      var copycount = this.state.count
      copycount = copycount+1
      this.setState({count: copycount})
  
      var copyavailableSlots = this.state.availableSlots
      copyavailableSlots = copyavailableSlots - 1
      this.setState({availableSlots: copyavailableSlots})
    }
  
    deleteGuest = (guestInfo) => {
    
      const copyGuestlist = this.state.guestlist
      const newGuestlist = []
      for(var i=0;i<copyGuestlist.length;i++){
        if(copyGuestlist[i]!=guestInfo){
          newGuestlist.push(copyGuestlist[i])
        }
      }
      this.setState({guestlist: newGuestlist})
    
      var copyavailableSlots = this.state.availableSlots
      copyavailableSlots = copyavailableSlots + 1
      this.setState({availableSlots: copyavailableSlots})
    }

    handleRegister() {
      this.setState({isAtHome: false});
      this.setState({isAtRegister: true})
    }
    
    handleLogin() {
      this.setState({isAtHome: false});
      this.setState({isAtLogin: true})
    }

    handlePost() {
      this.setState({isAtHome: false});
      this.setState({isAtPost: true})
    }

    handleShowpost() {
      this.setState({isAtHome: false});
      this.setState({isAtShowpost: true})
    }

    handleSearch() {
      this.setState({isAtHome: false});
      this.setState({isAtSearch: true})
    }

    handleMKBClick() {
      this.setState({isAtHome: false});
      this.setState({isAtResearvation: true})
    }
  
    handleDisplay() {
      this.setState({isAtHome: false});
      this.setState({isAtDisplay: true})
    }
    
    handleModify(){
      this.setState({isAtHome: false});
      this.setState({isAtModify: true})
    }
  
  
    handleBack2Homepage() {
      this.setState({isAtHome: true});
      this.setState({isAtResearvation: false})
      this.setState({isAtDisplay: false})
      this.setState({isAtModify: false})
      this.setState({isSubmitSuccess: false})

      this.setState({isAtRegister: false})
      this.setState({isAtLogin: false})
      this.setState({isAtPost: false})
      this.setState({isAtShowpost: false})
      this.setState({isAtSearch: false})
    }
  
    handleSubmitSuccess(is_success) {
      if(is_success){
        this.setState({isSubmitSuccess: true});
      } else{
        this.setState({isSubmitSuccess: false});
      }
    }
    
    async checkUsername(id) {
      //console.log('load_data')
      const query = `query {
        issueList {
          id 
          password
        }
      }`;
  
      const data = await graphQLFetch(query);
      if (data) {
        const issueList = data.issueList
        for (var i =0; i< issueList.length; i++)
        {
          if(issueList[i][id] == id){
            console.log('repeated')
          }
        }
        //console.log(data)
        //this.setState({ issues: data.issueList,
                        //availableSlots: 25 - data.issueList.length});
      }
    }
    
    //loaddata
    async loadData() {
      //console.log('load_data')
      const query = `query {
        issueList {
          _id
          id 
          password
          created

          movietitle
          language
          genre
          country
          JD
          isPost
        }
      }`;
  
      const data = await graphQLFetch(query); 
      if (data) {
        console.log('test')
        console.log(data.issueList.length)
        console.log(data)
        console.log(data.length)
        console.log(data[0])
        //this.setState({ issues: data.issueList,
                        //availableSlots: 25 - data.issueList.length});
      }
    }
    
    async loginsubmit(issue) {
      //console.log('createissue')
      const query = `query {
        issueList {
          id 
          password
        }
      }`;
      const data = await graphQLFetch(query, { issue });
      if (data) {
        const issueList = data.issueList
        var is_exist = false
        for (var i =0; i< issueList.length; i++)
        {
          console.log(issueList[i])
          console.log(issue.id)
          console.log(issueList[i].id)

          if((issueList[i].id == issue.id) && (issueList[i].password == issue.password)){
            is_exist = true
            console.log('loginsafe')
            break
          }
        }

        if(is_exist == true){
          this.setState(
            {currentuser: issue.id}
          )
        } else {
          alert('Username or Password Wrong!')
        }
    }
  }

  //show post
  async showpost(issue) {
    //console.log('createissue')
    const query = `query {
      issueList {
        id 
        password
        created
        movietitle
        language
        genre
        country
        JD
        isPost
      }
    }`;
    const data = await graphQLFetch(query, { issue });
    var parse_data = []
    if (data) {
      const issueList = data.issueList
      var is_exist = false
      for (var i =0; i< issueList.length; i++)
      {
        if(issueList[i].isPost == 1){
          parse_data.push(issueList[i])
        }
        // console.log(issueList[i])
        // console.log(issue.id)
        // console.log(issueList[i].id)
      }
      this.setState({postdata: parse_data})
      console.log('inside func')
      console.log(parse_data)
  }
}
    //write in data
    async createIssue(issue) {
      //console.log('createissue')
      //issue._id = this.state.unique_id
      const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
      }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
        //this.checkUsername(issue.id)
        //let a = this.state.unique_id
        //this.setState({unique_id: a+1})

      }
      return data
    }

    //post a job
    async postjob(issue) {
      //console.log('createissue')
      const query = `mutation postAdd($issue: postinput!) {
        postAdd(issue: $issue) {
          id
        }
      }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
        //this.checkUsername(issue.id)
      }
      return data
    }

    //delete data
    async deleteIssue(issue) {
      //console.log('deleteissue')
      const query = `mutation issueDelete($issue: IssueDelInputs!) {
        issueDelete(issue: $issue) {
          id
        }
      }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
      }
    }



    render(){
      const guestlist_cs = this.state.guestlist
      let MKB,DSB,MDB;
      const isstable = <IssueTable issues={this.state.issues} isShow={!this.state.isAtDisplay} />
      MKB = <ButtonRegister onClick={this.handleRegister} isShow = {!this.state.isAtHome} />
      DSB = <ButtonLogin onClick={this.handleLogin} isShow={!this.state.isAtHome}/>
      MDB = <ButtonPost onClick={this.handlePost} isShow={!this.state.isAtHome}/>
      const BSP = <ButtonShowpost onClick={this.handleShowpost} isShow={!this.state.isAtHome}/>
      const BSM = <ButtonSearchmovie onClick={this.handleSearch} isShow={!this.state.isAtHome}/>
      const BHPB = <Back2HomepageButton onClick={this.handleBack2Homepage} isShow={this.state.isAtHome} />
      //const ADDG = <AddGuest count = {this.state.count} createIssue = {this.createIssue}addGuest = {this.addGuest} guestlist = {this.state.guestlist} availableSlots={this.state.availableSlots} isSubmitSuccess={this.state.isSubmitSuccess} handleSubmitSuccess={this.handleSubmitSuccess} isShow = {!this.state.isAtResearvation}/>
      //const MDG = <ModifyGuest guestlist={this.state.guestlist} deleteIssue = {this.deleteIssue} deleteGuest={this,this.deleteGuest} isSubmitSuccess={this.state.isSubmitSuccess} handleSubmitSuccess={this.handleSubmitSuccess} isShow={!this.state.isAtModify}/>
      const SM = <ShowMovie movie_detail = {this.state.movie_detail} similars = {this.state.similars} isShow = {!this.state.isAtSearch}/>
      const register = <Register createIssue = {this.createIssue} handleSubmitSuccess={this.handleSubmitSuccess} isSubmitSuccess={this.state.isSubmitSuccess} isShow = {!this.state.isAtRegister}/>
      const login = <Login loginsubmit = {this.loginsubmit} handleSubmitSuccess={this.handleSubmitSuccess} isSubmitSuccess={this.state.isSubmitSuccess} isShow={!this.state.isAtLogin}/>
      const postjob = <Postjob postjob = {this.postjob} currentuser = {this.state.currentuser} isShow={!this.state.isAtPost} handleSubmitSuccess={this.handleSubmitSuccess} isSubmitSuccess={this.state.isSubmitSuccess}/>
      const showpost = <ShowPost showpost = {this.showpost} isShow={!this.state.isAtShowpost}/>
      const posts = <Posts similars = {this.state.postdata} isShow={!this.state.isAtShowpost}/>
      return(
          <div>
           
           <h1> For Filmmakers </h1>
           
          <p> Current User:   <span>{this.state.currentuser}</span> </p>
          {BHPB}
          {MKB}
          {DSB}
          {MDB}
          {BSP}
          {BSM}
          {login}
          {postjob}
          {showpost}
          {isstable}
          {posts}
          <SearchMovie updateMovieDetail = {this.updateMovieDetail} isShow={!this.state.isAtSearch}/>
          {SM}
          {register}
          <hr />
         
          </div>
    );
    }
  }
  
  

//Navibar buttons
  
  function ButtonRegister (props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Register
      </button>
    )
  }
  
  function ButtonLogin(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Login
      </button>
    )
  }

  function ButtonPost(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Post a job
      </button>
    )
  }

  function ButtonShowpost(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Posted Job
      </button>
    )
  }

  function ButtonSearchmovie(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Search a movie
      </button>
    )
  }
  
  function  Modify(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Update the List 
      </button>
    )
  }
  
  
  function Back2HomepageButton(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Back to HomePage
      </button>
    )
  }
  
  
  class AddGuest extends React.Component{
    constructor(props){
      super(props)
    }
    add(){
      const username = this.username.value.trim()
      const phone = this.userphone.value.trim()
      const phonenum = this.userphone.value.trim()

      if((username!='')&&(phone!='')){
        var today = new Date()
        const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '  '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        const serial = this.props.count + 1
        const guestInfo = [serial, username, phone, date]
        const issue = {name:username, phone: phonenum, created: date}
        

        if(this.props.availableSlots < 1){
          alert("Sorry. We are currently full.")
        } else {
          //this.props.addGuest(guestInfo)
          this.props.handleSubmitSuccess(true)
          this.props.createIssue(issue)
        }
      }else{
        this.props.handleSubmitSuccess(false)
        alert("Required Field Misiing!")
      }
    }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <span> Input Your Name </span>
            <input type="Name" name = 'Input your name' ref={input => this.username=input}/>
            <span> Input Your Phone </span>
            <input type="Telephone" ref={input => this.userphone=input}/>
            <button onClick={this.add.bind(this)}>Submit </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Submit success</p>
        </div>
    )
  
    }
  }
  
  class ModifyGuest extends React.Component{
    constructor(props){
        super(props)
      }
      modify(){
        const serial_num = Number(this.serialnum.value.trim())
        const issue = {id:serial_num}
        this.props.deleteIssue(issue)
  
      }
      render(){
        return (
          <div hidden={this.props.isShow}>
              <span> Input Customer Serial Num </span>
              <input type="Name" text = 'Input Customer Serial Num' ref={input => this.serialnum=input}/>
              <button onClick={this.modify.bind(this)}>Submit</button>
              <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Modify success</p>
          </div>
        )
  }
  }
  
  class ShowTable extends React.Component{
    constructor(props){
      super(props)
    }
    
    render(){
      const guestlist = []
      const RenderRow = (props) =>{
        return props.keys.map((key, index)=>{
        return <td key={props.data[key]}>{props.data[key]}</td>
        })
       }
      var i = 0
      
      return (
        //using map to parse obj and convert it into a table
        <div hidden={!this.props.isShow}>
            <h2> Current Waiting Customers </h2> 
            <table>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Guest Name</th>
                  <th>Phone Number</th>
                  <th>Time Stamp</th>
                </tr>
              </thead>
              <tbody>
              {
              
               
              } 
              </tbody>
            </table>
        </div>
      );
    }
 
  }
  
  class SearchMovie extends React.Component{
    constructor(props){
      super(props)
    }
    async searchmovie()
    {

      const movie_name = this.moviename.value.trim()
      const API_KEY = '8d876c08';
      const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${movie_name}`);
      const {Search = []} = await res.json();
     
      //console.log(Search[0]['imdbID'])
      const imdbid = Search[0]['imdbID']

      //http://www.omdbapi.com/?apikey=8d876c08&s=avengers
      //https://imdb-api.com/en/API/Title/k_h5qo5093/tt0110413

      //const imdbid = 'tt0848228'
      const imdb_api_key = 'k_h5qo5093'

      const url = `https://imdb-api.com/en/API/Title/${imdb_api_key}/${imdbid}`
      console.log(url)
      
      
      //const url = http://www.omdbapi.com/?apikey=8d876c08&s=avengers
      //const url = https://imdb-api.com/en/API/Title/k_h5qo5093/tt0110413
      const req = await fetch(url)
      const moviedata = await req.json();
      this.props.updateMovieDetail(moviedata)
      

      //console.log(req)
      //const {movie_detail} = await req.json();
      //console.log(movie_detail)
    }
    
    render(){
      
      
      return (
        //using map to parse obj and convert it into a table
        <div hidden = {this.props.isShow}>
            <h2> input movie </h2> 
            <span> Input Movie name </span>
              <input type="Name" text = 'Input Movie name' ref={input => this.moviename=input}/>
              <button onClick={this.searchmovie.bind(this)}>Submit</button>
        </div>
      );
    }
  }
  
  class ShowMovie extends React.Component{
    constructor(props){
      super(props)

  
    }
    
    
    render(){
      const data = this.props.movie_detail;
      //console.log('test_show_movie');
      //console.log(data);
      //console.log(this.props.movie_detail['similars']);
      // let a = this.props.movie_detail['similars']
      // console.log(a)
      // console.log(typeof(a))
      

      if (data.hasOwnProperty('title'))
      {
        this.title = data['title']
      }
      
      if (data.hasOwnProperty('year'))
      {
        this.year = data['year']
      }

      if (data.hasOwnProperty('genres'))
      {
        this.genres = data['genres']
      }

      if (data.hasOwnProperty('directors'))
      {
        this.directors = data['directors']
      }

      if (data.hasOwnProperty('stars'))
      {
        this.stars = data['stars']
      }
      if (data.hasOwnProperty('languages'))
      {
        this.languages = data['languages']
      }
      if (data.hasOwnProperty('image'))
      {
        this.image = data['image']
      }
      if (data.hasOwnProperty('countries'))
      {
        this.countries = data['countries']
      }
      if (data.hasOwnProperty('keywords'))
      {
        this.keywords = data['keywords']
      }
      if (data.hasOwnProperty('writers'))
      {
        this.writers = data['writers']
      }

      // if (this.props.movie_detail == [])
      // {

      // } else
      // {
      //   const title = this.props.movie_detail['title']
      //   this.title = title
      // }
      let director_herf = `https://www.google.com/search?q=${this.directors}`

      return (
        //using map to parse obj and convert it into a table
        // <Similars similars={this.props.movie_detail['similars']} />
        <div hidden = {this.props.isShow}>
            <h2> show movie </h2> 
            <span> Title: {this.title} </span>
            <br />
            <a href={director_herf}> {this.directors} </a>
            <br />
            <span> Year: {this.year} </span>
            <br />
            <span> Genres: {this.genres} </span>
            <br />
            <span> Directors: {this.directors} </span>
            <br />
            <span> Stars: {this.stars} </span>
            <br />
            <span> Languages: {this.languages} </span>
            <br />
            <span> Countries: {this.countries} </span>
            <br />
            <span> Keywords: {this.keywords} </span>
            <br />
            <span> Writer(s): {this.writers} </span>
            <br />
            <img width = {800} height = {1200} src = {this.image} /> 
            <h3> similar movies </h3>

            <Similars similars = {this.props.similars} />
            
        </div>
      ); 
    }
  }
  

  class Register extends React.Component{
    constructor(props){
      super(props)
    }
    add(){
      const username = this.username.value.trim()
      const password = this.password.value.trim()

      if((username!='')&&(password!='')){
        
        const issue = {id:username, password: password}
        

        if(this.props.availableSlots < 1){
          alert("Sorry. We are currently full.")
        } else {
          //this.props.addGuest(guestInfo)
          this.props.handleSubmitSuccess(true)
          const data = this.props.createIssue(issue)
          console.log('test')
          console.log(data)
        }
      }else{
        this.props.handleSubmitSuccess(false)
        alert("Required Field Misiing!")
      }
    }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <span> Input Your UserName </span>
            <input type="Name" name = 'Input your Username' ref={input => this.username=input}/>
            <span> Input Your Password </span>
            <input type="Password" ref={input => this.password=input}/>
            <button onClick={this.add.bind(this)}>Submit </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Register success</p>
        </div>
    )
  
    }
  }

  class Login extends React.Component{
    constructor(props){
      super(props)
    }
    login(){
      const username = this.username.value.trim()
      const password = this.password.value.trim()

      if((username!='')&&(password!='')){
        //var today = new Date()
        //const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '  '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        //const serial = this.props.count + 1
        //const guestInfo = [serial, username, phone, date]
        const issue = {id:username, password: password}
        

        if(this.props.availableSlots < 1){
          alert("Sorry. We are currently full.")
        } else {
          //this.props.addGuest(guestInfo)
          this.props.handleSubmitSuccess(true)
          const data = this.props.loginsubmit(issue)
          console.log('test')
          console.log(data)
        }
      }else{
        this.props.handleSubmitSuccess(false)
        alert("Required Field Misiing!")
      }
    }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <span> Input Your UserName </span>
            <input type="Name" name = 'Input your Username' ref={input => this.username=input}/>
            <span> Input Your Password </span>
            <input type="Password" ref={input => this.password=input}/>
            <button onClick={this.login.bind(this)}>Login </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Login success</p>
        </div>
    )
  
    }
  }

  class Postjob extends React.Component{
    constructor(props){
      super(props)
    }
    post(){
      const moviename = this.moviename.value.trim()
      const movielanguage = this.movielanguage.value.trim()
      const genre = this.genre.value.trim()
      const country = this.country.value.trim()
      const jd = this.jd.value.trim()
      //if this.props.currentuser = ''
      if((moviename!='')&&(jd!='')){
        //var today = new Date()
        //const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '  '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        //const serial = this.props.count + 1
        //const guestInfo = [serial, username, phone, date]
        const issue = {
          id: moviename,
          movietitle: moviename,
          language: movielanguage,
          genre: genre,
          country: country,
          JD: jd,
          isPost: 1}
        

      
          //this.props.addGuest(guestInfo)
          //this.props.handleSubmitSuccess(true)
          const data = this.props.postjob(issue)
          console.log('test')
          console.log(data)
        } else{
        //this.props.handleSubmitSuccess(false)
        alert("Required Field Misiing!")
      }
    }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <h2> Post A Job </h2>
            <span> Input Your Movie Name </span>
            <input type="moviename" name = 'Input your Username' ref={input => this.moviename=input}/>
            <br />
            <span> Input Your Movie Language </span>
            <input type="movielanguage" ref={input => this.movielanguage=input}/>
            <br />
            <span> Input Your Movie genre </span>
            <input type="genre" name = 'Input your Username' ref={input => this.genre=input}/>
            <br />
            <span> Input Your Country </span>
            <input type="country" name = 'Input your Username' ref={input => this.country=input}/>
            <br />
            <span> Input Your Job Description </span>
            <input type="jd" name = 'Input your Username' ref={input => this.jd=input}/>
            <br />

            <button onClick={this.post.bind(this)}>Post A Job </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Post success</p>
        </div>
    )
  
    }
  }
  

  class ShowPost extends React.Component{
    constructor(props){
      super(props)
    }
    displaypost(){
          //this.props.addGuest(guestInfo)
          //this.props.handleSubmitSuccess(true)
          const data = this.props.showpost()
          console.log('test')
          console.log(data)
      }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <h2> Show Job Posted </h2>
            <button onClick={this.displaypost.bind(this)}>Show All Jobs Posted </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Submit success</p>
        </div>
    )
  
    }
}
  
  const element = <HomePage />
  ReactDOM.render(element, document.getElementById('contents'));

  
  
  
  
  
  