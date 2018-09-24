import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as models from '../models/category';
import * as Modal from 'react-modal';
import { CreateEdit } from './CreateEdit';
import { Details } from './Details';
import { AddArticleToCategory } from './AddArticleToCategory';

import * as article from '../models/article';
import axios from 'axios';

//for jQuery uses
//import $ from 'jquery';

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        marginBottom: '-50%',
        //background: '#fff',
        transform: 'translate(-50%, -50%)',
        minHeight: '530px',
        minWidth: '340px',
        maxWidth: '340px'
    }
};

interface CategoryState {
    category: models.Category[],
    categoryDetails: models.Category;
    categoryId: number;
    article: article.Article[],
    loading: boolean,
    showCreate: boolean,
    showDetails: boolean,
    showEdit: boolean,
    showAddArticle: boolean,
    activeId: number
}

let rowSelected = [];

export class Category extends React.Component<RouteComponentProps<{}>, CategoryState> {
    constructor(props) {
        super(props);
        this.state = {
            category: [],
            categoryDetails: new models.Category,
            categoryId: null,
            article: [],
            loading: true,
            showCreate: false,
            showDetails: false,
            showEdit: false,
            showAddArticle: false,
            activeId: 0
        };
        this.updateStateCategory();
    }

    updateStateCategory() {
        fetch('api/Categories')
            .then(response => response.json() as Promise<models.Category[]>)
            .then(data => {
                this.setState({ category: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTable(this.state.category, true);
        let details = this.renderDetails(this.state.article, false);
        let popup = this.renderPopup();

        return <div className='row'>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <div>
                    <h1>Categories</h1>
                    <div className="text-right">
                        <button className="btn btn-primary" onClick={this.handleCreate.bind(this)} >
                            <span className='glyphicon glyphicon-plus'></span>&nbsp;New Category
                    </button>
                    </div>
                </div>
                {contents}
                {popup}
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <div>
                    <h1>Category articles</h1>
                    <div className="text-right">
                        <button className="btn btn-primary" onClick={(id) => this.handleAddArticle(this.state.activeId)} title='Add article to this categorie'>
                            <span className='glyphicon glyphicon-plus'></span>&nbsp;Add Article
                        </button>
                        &nbsp;&nbsp;
                        <button className="btn btn-danger" onClick={this.handleRemoveArticleMultiple.bind(this)} title='Remove selected articles from this category' >
                            <span className='glyphicon glyphicon-minus'></span>&nbsp;Remove Article
                        </button>
                    </div>
                </div>
                {details}
            </div>
        </div>;
    }

    private renderTable(category: models.Category[], allowSort: boolean = false) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {category.map(item =>
                    <tr key={item.Id}>
                        <td>{item.Id}</td>
                        <td>{item.Name}</td>
                        <th>
                            <button className='btn btn-xs btn-info' onClick={(id) => this.handleDetails(item.Id)} title='See all articles of this category'>
                                <span className='glyphicon glyphicon-info-sign'></span>&nbsp;Details
                            </button>&nbsp;
                            <button className='btn btn-xs btn-warning' onClick={(id) => this.handleEdit(item.Id)}>
                                <span className='glyphicon glyphicon-pencil'></span>&nbsp;Edit
                            </button>&nbsp;
                            <button className='btn btn-xs btn-danger' onClick={(id) => this.handleDelete(item.Id)}>
                                <span className='glyphicon glyphicon-trash'></span>&nbsp;Delete
                            </button>
                        </th>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    private renderDetails(article: article.Article[], allowSort: boolean = false) {
        return <table className='table'>
            <thead>
                <tr>
                    <th><input type="checkbox" name="chk[]" onClick={this.checkAllArticles.bind(this)} /></th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {article.map(item =>
                    <tr key={item.Id} id={"tr_" + item.Id}>
                        <td><input type="checkbox" name="Id[]" id={"chk_" + item.Id} value={item.Id} onClick={(id) => this.checkArticles(item.Id)} /></td>
                        <td>{item.Name}</td>
                        <th>
                            <button className='btn btn-xs btn-danger' onClick={(id) => this.handleRemoveArticle(item.Id)} title='Remove this article from this categorie'>
                                <span className='glyphicon glyphicon-minus'></span>&nbsp;Remove
                            </button>
                        </th>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    handleCreate() {
        this.setState({ showCreate: true, showDetails: false, showEdit: false, showAddArticle: false });
    }

    //handleDetails(id: number) {
    //    this.setState({ showCreate: false, showDetails: true, showEdit: false, activeId: id });
    //}

    handleDetails(id: number) {
        fetch('api/Articles/GetArticlesByCategoryId/' + id, { method: 'GetArticlesByCategoryId' })
            .then(response => response.json() as Promise<article.Article[]>)
            .then(data => {
                this.setState({ categoryId: id, article: data, loading: false, activeId: id });
            });
    }

    handleEdit(id: number) {
        this.setState({ showCreate: false, showDetails: false, showEdit: true, activeId: id });
    }

    handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this category?'))
            return
        fetch('api/categories/delete/' + id, { method: 'delete' })
            .then(data => {
                this.setState({
                    category: this.state.category.filter((rec) => { return rec.Id != id; })
                });
            });
    }

    handleRemoveArticleMultiple() {

        //https://github.com/axios/axios

        if (rowSelected.length > 0) {
            if (!confirm('Are you sure you want to remove this articles from this category?'))
                return

            axios.post('api/ArticleCategories/DeleteMultiple', rowSelected)
                .then(response => {
                    this.handleDetails(this.state.categoryId); 
                })
                .catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                })
        }
        else
            alert("There are not articles chosen to remove");
    }

    handleAddArticle(id: number) {
        this.setState({ showCreate: false, showDetails: false, showEdit: false, activeId: id, showAddArticle: true });
    }

    handleRemoveArticle(id: number) {
        if (!confirm('Are you sure you want to remove this article from this categorie?'))
            return
        fetch('api/ArticleCategories/delete/' + id, { method: 'delete' })
            .then(data => {
                this.setState({
                    article: this.state.article.filter((rec) => { return rec.Id != id; })
                });
            });
    }

    private renderPopup() {
        if (!this.state.showCreate && !this.state.showEdit && !this.state.showDetails && !this.state.showAddArticle)
            return null;
        return <Modal isOpen={true} contentLabel='Crawl' style={customStyles}>
            <div className="col-lg-12 text-right">
                <button className='close' title='Cancel' onClick={this.closeModal.bind(this)} id='btnCloseModal'>&times;
                </button>
            </div>
            <div className="col-lg-12">{this.renderPopupContent()}</div>
        </Modal>
    }

    private renderPopupContent() {
        if (this.state.showCreate) {
            return <CreateEdit id={null} dbaction="create" onSave={this.handlePopupSave.bind(this)} />
        }
        if (this.state.showEdit) {
            return <CreateEdit id={this.state.activeId} dbaction="edit" onSave={this.handlePopupSave.bind(this)} />

        }
        if (this.state.showDetails) {
            return <Details id={this.state.activeId} />
        }
        if (this.state.showAddArticle) {
            if (this.state.categoryId === null) {
                alert("Choose a category to add articles");
                this.closeModal();
            }
            else {
                //fetch('api/Categories/GetById/' + this.state.categoryId)
                //    .then(response => response.json() as Promise<models.Category>)
                //    .then(data => {
                //        this.setState({ categoryDetails: data, loading: false });
                //    });
                return <AddArticleToCategory categoryId={this.state.activeId} onSave={this.handlePopupSave.bind(this)} />
            }
        }
    }

    closeModal() {
        this.setState({ showCreate: false, showDetails: false, showEdit: false, showAddArticle: false });
    }

    handlePopupSave(success: boolean, actionFrom: string) {
        if (success)
            this.setState({ showCreate: false, showEdit: false, showAddArticle: false });

        switch (actionFrom){
            case "actionFromAddArticleToCategory":
                this.handleDetails(this.state.categoryId);
                break;
            case "actionFromCreateEdit":
                this.updateStateCategory();
                break;
        }
    }

    private checkAllArticles() {
        var checkboxes = document.getElementsByTagName('input');
        var val = null;

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if (val === null) val = checkboxes[i].checked;
                checkboxes[i].checked = val;

                if (i > 0) {
                    if (checkboxes[i].checked) {
                        rowSelected.push(checkboxes[i].value)
                        document.getElementById('tr_' + checkboxes[i].value).classList.add("info");
                    }
                    else {
                        var index = rowSelected.indexOf(checkboxes[i].value);
                        rowSelected.splice(index, 1);

                        document.getElementById('tr_' + checkboxes[i].value).classList.remove("info");
                    }
                }
            }
        }
        //console.log(rowSelected);
    }

    private checkArticles(id: number) {

        let checkbox: any = document.getElementById('chk_' + id);
        //var tr = document.getElementById('tr_' + id);

        if (checkbox.checked) {
            rowSelected.push(checkbox.value)
            document.getElementById('tr_' + id).classList.add("info");
        }
        else {
            var index = rowSelected.indexOf(checkbox.value);
            rowSelected.splice(index, 1);

            document.getElementById('tr_' + id).classList.remove("info");
        }

        //if ($('#chk_' + id).is(":checked")) {
        //    $('#tr_' + id).addClass("warning");
        //}
        //else {
        //    $('#tr_' + id).removeClass("warning");
        //}
    }
}