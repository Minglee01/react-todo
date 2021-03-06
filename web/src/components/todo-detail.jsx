import React, { Component } from 'react';
var $ = require("jquery");

export const getId = function() {
    return window.location.pathname.replace('/details/', '');
}

export const addItem = function(item) {
    var listId = getId();

    $.ajax({
        method: 'POST',
        url: "/todos/item/create",
        data: { 
            content: item,
            todoId: listId
        }
    })
}

export const getList = function() {
    var result = null;
    var listId = getId();

    $.ajax({
        url: "/todos/" + listId,
        type: 'get',
        async: false,
        success: function(data) {
            result = data;
        } 
     });
    return result;
}

export const deleteList = function () {
    var listId = getId();

    $.ajax({
        url: "/todos/" + listId + "/delete",
        type: 'delete',
        async: false,
        success: function(data) {
            window.location = '/';
        } 
    });
}

export const updateItem = function (id, status) {
    var listId = getId();
    $.ajax({
        url: "/todos/item/" + id + "/update",
        type: 'put',
        async: false,
        data: { 
            todoItemId: id,
            todoId: listId,
            complete: status
        },
        success: function(data) {
        } 
    });
}

var items = null;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
          todoLists: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleInputChange(event) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === event.target.value) {
                if (items[i].complete === false) {
                    updateItem(items[i].id, true)
                } else {
                    updateItem(items[i].id, false)
                }
            }
        }
    }

    handleSubmit(event) {
        addItem(this.state.value)
        event.preventDefault();
    }

    render() {
        var list = getList()
        items = list.todoItems;

        return (
            <div>
                <h2>{list.title}</h2>
                {items.map(list =>
                    <li key={list.id}>
                        <form>
                            <label>
                              <input
                                name="complete"
                                type="checkbox"
                                value={list.id}
                                defaultChecked={list.complete}
                                onChange={this.handleInputChange} />
                            </label>
                        </form>
                        {list.content}
                    </li>
                )}
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Add New Todo Item: 
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={deleteList}>
                    Delete List
                </button>
            </div>
        );
    }
}

export default App;