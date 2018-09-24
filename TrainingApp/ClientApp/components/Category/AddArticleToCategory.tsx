import * as React from 'react';
import PropTypes from 'prop-types';
import * as category from '../models/category';
import { Dropdown } from '../utility/Dropdown';
import * as ReactDOM from 'react-dom';

interface AddArticleToCategoryState {
    categories: category.Category[];   
    category: category.Category;
    dropdownSourceList: category.Category[];
    loading: boolean;
    save: boolean;
}

interface AddArticleToCategoryProps {
    categoryId: number;    
    onSave?: any;
}

export class AddArticleToCategory extends React.Component<AddArticleToCategoryProps, AddArticleToCategoryState> {
    child: Dropdown;
    constructor(props) {
        super(props);
        this.state = {
            dropdownSourceList: null,
            category: null,
            categories: null,
            loading: true,
            save: false
        }
        fetch('api/Categories/GetById/' + this.props.categoryId, { method: 'get' })
            .then(response => response.json() as Promise<category.Category>)
            .then(data => {
                this.setState({ category: data, loading: false });
            });
        fetch('api/Articles/GetArticlesNotInCategoryId/' + this.props.categoryId, { method: 'get' })
            .then(response => response.json() as Promise<category.Category[]>)
            .then(data => {
                this.setState({ dropdownSourceList: data, loading: false });
                //console.log(this.state.dropdownSourceList);
            });
    }
    handleSave(e) {
        e.preventDefault()
        var CategoryId = this.props.categoryId
        let articleCategory = [];

        var dropdownList = this.child.returnValues().toString().split(",");

        dropdownList.forEach(function (element) {
            articleCategory.push({ 'ArticleId': parseInt(element), 'CategoryId': CategoryId})
        });

        fetch('api/ArticleCategories/InsertMultiple',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleCategory)
            })
            .then(data => {
                this.setState({ save: false });
                this.props.onSave(true, 'actionFromAddArticleToCategory');
                document.getElementById("btnCloseModal").click();
            }).catch(err => err);
    }
    handleCancel() {
        document.getElementById("btnCloseModal").click();
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderForm(this.state.category);
        return <div>
            <h1>Add Article</h1>
            {contents}
        </div>;
    }

    private renderForm(item: category.Category){
        return <form id="formAddArticleToCategory"> 
            <div className="form-group">
                <label>Category Id</label>
                <input id='CategoryId' name='CategoryId' readOnly={true}
                    defaultValue={item.Id != null ? (item.Id + '') : ''} className='form-control' />
            </div>
            <div className="form-group">
                <label>Category Name</label>
                <input id='CategoryName' name='CategoryName' type='text' className='form-control'
                    defaultValue={item.Name != null ? (item.Name + '') : ''} readOnly={true} />
            </div>
            <div className="form-group">
                
                <label>Articles</label>
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