import React, { Component } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import NoImage from './images/404_img.jpg'
import PropTypes from 'prop-types'


export default class News extends Component {

  static defaultProps={
    country: 'in',
    pageSize: 10,
    category: 'general' 
  }

  static propTypes={
    country: PropTypes.string,
    pageSize:PropTypes.number,
    category: PropTypes.string
  }
  
  constructor(){
    super();
    this.state={
      articles:[],
      loading:false,
      page:1,
      
      
    }
    
  }

  async componentDidMount(){
    
    this.updateNews();
    document.title='News_'+this.props.category.toUpperCase()
  }

  updateNews= async ()=>{

    const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=829ea012824442d7856c700b0116d551&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data=await fetch(url);
    let parsedData=await data.json()

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    })
  }


  handelPrevClick= async ()=>{
  this.setState({
      page:this.state.page-1,
    })
  }

  handelNextClick= async ()=>{
    this.setState({
      page:this.state.page+1,
    })  
}

  render() {
    return (
      <div className='container my-3'>
        <h2>Top Headlines</h2>
        <div className="card-header">{(this.props.category).toUpperCase()}</div>
        {this.state.loading && <Spinner/>}
        <div className='row '>
        { !this.state.loading && this.state.articles.map((element)=>{

          return <div className='col-md-3 mx-auto'  key={element.url}>
            <NewsItems title={element.title.length >= 45 ? element.title.slice(0, 45) : element.title} publishedAt={element.publishedAt} author={element.author} source={element.source.name}
            description={element.description !== null && element.title.length >= 45 ? element.description.slice(0, 60) : element.description} imgUrl={element.urlToImage === null ? NoImage:element.urlToImage} newsUrl={element.url}/>
            </div>
          })} 
        </div>
        <div className='container d-flex justify-content-between'>
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handelPrevClick}>Previous</button>
        <button disabled={this.state.page + 1 > Math.round(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handelNextClick}>Next</button>
        </div>
      </div>
    )
  }
}
