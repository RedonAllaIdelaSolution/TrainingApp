import * as React from 'react';
import * as article from '../models/article';
import { Dropdown } from '../utility/Dropdown';
import * as ReactDOM from 'react-dom';

interface AddCategoryToArticleState {
    articles: article.Article[];
    article: article.Article;
    dropdownSourceList: article.Article[];
    loading: boolean;
    save: boolean;
}

interface AddCategoryToArticleProps {
    articleId: number;
    onSave?: any;
}

export class AddCategoryToArticle extends React.Component<AddCategoryToArticleProps, AddCategoryToArticleState> {
    child: Dropdown;
    constructor(props) {
        super(props);
        this.state = {
            dropdownSourceList: null,
            article: null,
            articles: null,
            loading: true,
            save: false
        }
        fetch('api/Articles/GetById/' + this.props.articleId, { method: 'get' })
            .then(response => response.json() as Promise<article.Article>)
            .then(data => {
                this.setState({ article: data, loading: false });
            });
        fetch('api/Categories/GetCategoriesNotInArticle/' + this.props.articleId, { method: 'get' })
            .then(response => response.json() as Promise<article.Article[]>)
            .then(data => {
                this.setState({ dropdownSourceList: data, loading: false });
                console.log(this.state.dropdownSourceList);
            });
    }
    handleSave(e) {
        e.preventDefault()
        var ArticleId = this.props.articleId
        let articleCategory = [];

        var dropdownList = this.child.returnValues().toString().split(",");

        dropdownList.forEach(function (element) {
            articleCategory.push({ 'ArticleId': ArticleId, 'CategoryId': parseInt(element) })
        });

        fetch('api/ArticleCategories/InsertMultiple',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleCategory)
            })
            .then(data => {
                this.setState({ save: false });
                this.props.onSave(true, 'actionFromAddCategoryToArticle');
                document.getElementById("btnCloseModal").click();
            }).catch(err => err);
    }
    handleCancel() {
        document.getElementById("btnCloseModal").click();
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderForm(this.state.article);
        return <div>
            <h1>Add Category</h1>
            {contents}
        </div>;
    }

    private renderForm(item: article.Article) {
        return <form id="AddCategoryToArticle">
            <div className="form-group">
                <label>Article Id</label>
                <input id='ArticleId' name='ArticleId' readOnly={true}
                    defaultValue={item.Id != null ? (item.Id + '') : ''} className='form-control' />
            </div>
            <div className="form-group">
                <label>Article Name</label>
                <input id='ArticleName' name='ArticleName' type='text' className='form-control'
                    defaultValue={item.Name != null ? (item.Name + '') : ''} readOnly={true} />
            </div>
            <div className="form-group">

                <label>Categories</label>
                <Dropdown
                    removeSelected={true}
                    disabled={false}
                    crazy={false}
                    stayOpen={false}
                    sourceList={this.state.dropdownSourceList}
                    rtl={false}
                    ref={instance => { this.child = instance; }}
                />
            </div>
            <div className="text-right">
                <button className='btn btn-default' title='Cancel' onClick={this.handleCancel.bind(this)}>
                    <span className='glyphicon glyphicon-ban-circle'></span>&nbsp;Cancel
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-success" onClick={this.handleSave.bind(this)} >
                    <span className='glyphicon glyphicon-floppy-saved'></span>&nbsp;Save
                </button>
            </div>
        </form>;
    }
}