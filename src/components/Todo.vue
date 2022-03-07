<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from 'axios';

export default {
    name: 'TodoList',
    props: {
    },
    components: {
        AgGridVue
    },
    methods: {
        addTodo() {
            const cellsEditing = this.gridApi.getEditingCells();
            if (cellsEditing && cellsEditing.length) {
                alert('Edit is in progress!')
                return;
            }
            this.gridApi.stopEditing(true);
            var today = new Date();
            this.gridApi.applyTransaction({
                add: [{title: '', description: '', due_date: today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear()}],
            });
            this.gridApi.forEachNode((rowNode, index) => {
                this.rowIndex = index
            });
            this.gridApi.startEditingCell({
                rowIndex: this.rowIndex,
                colKey: 'title'
            });
        },
        fetchData() {
            axios.get(this.baseURL + 'showtodos').then((response) =>{
                this.rowData = response.data;
            });
        },
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },
        onRowEditingStarted: (params) => {
            params.api.refreshCells({
                columns: ['action'],
                rowNodes: [params.node],
                force: true,
            });
            const nonSelectedGridRows = document.querySelectorAll('div.ag-row-no-focus:not(.ag-row-editing)');
            nonSelectedGridRows.forEach(row => {
                row.classList.add("pointer-events-none");
            });
        },
        onRowEditingStopped: (params) => {
            params.api.refreshCells({
                columns: ['action'],
                rowNodes: [params.node],
                force: true,
            });
            const nonSelectedGridRows = document.querySelectorAll('div.ag-row-no-focus:not(.ag-row-editing)');
            nonSelectedGridRows.forEach(row => {
                row.classList.remove("pointer-events-none");
            });
        },
        actionCellRenderer(params) {
            let buttonElem;
            let editingCells = params.api.getEditingCells();
            let isCurrentRowEditing = editingCells.some((cell) => {
                return cell.rowIndex === params.node.rowIndex;
            });
            if (isCurrentRowEditing) {
                buttonElem = `
                <div><button type="button" class="action-button btn btn-success" data-action="update"> Update  </button>
                <button button type="button" class="action-button btn btn-danger" data-action="cancel" > Cancel </button></div
                `;
            } else {
                buttonElem = `
                <div><button button type="button" class="action-button btn btn-primary" data-action="edit" > Edit  </button>
                <button button type="button" class="action-button btn btn-danger" data-action="delete" > Delete </button></div>
                `;
            }
            return buttonElem;
        },
        saveTodos() {
            let result = {todos: []}
            this.gridApi.forEachNode((rowNode) => {
                result.todos.push({title: rowNode.data.title, description: rowNode.data.description, due_date: rowNode.data.due_date})
            });
            axios.post(this.baseURL + 'savetodos', JSON.stringify(result)).then((response) =>{
                console.log('response: '+JSON.stringify(response.data));
            });
        },
        onCellClicked(params) {
            if (params.column.colId === 'action' && params.event.target.dataset.action ) {
                let action = params.event.target.dataset.action;
                if (action === 'edit') {
                    params.api.startEditingCell({
                        rowIndex: params.node.rowIndex,
                        colKey: 'title',
                    });
                }

                if (action === 'delete') {
                    params.api.applyTransaction({
                        remove: [params.node.data],
                    });
                    this.saveTodos();
                }

                if (action === 'update') {
                    params.api.stopEditing(false);
                    this.saveTodos();
                }

                if (action === 'cancel') {
                    params.api.stopEditing(true);
                }
            }
        }
    },
    data: function () {
        return {
            columnDefs: null,
            gridApi: null,
            columnApi: null,
            defaultColDef: {
            editable: true,
            suppressKeyboardEvent: params => {
                const key = params.event.key;
                if (key === 'Enter') {
                params.event.preventDefault()
                }
                return key === 'Enter' || key === 'Esc' || key === 'Tab';
            }
            },
            rowData: null,
            editType: 'fullRow',
            suppressClickEdit: true,
            rowIndex: 0,
            baseURL: 'http://localhost:3000/'
        };
    },
    mounted() {
        this.fetchData();
        this.columnDefs = [
            { headerName: "Title", field: 'title', filter: true, width: 250 },
            { headerName: "Description", field: 'description', width: 450 },
            { headerName: "Due Date", field: 'due_date', width: 200 },
            { headerName: "Actions", field: 'actions', editable: false, cellRenderer: this.actionCellRenderer, colId: 'action', width: 390}
        ];
    }
}
</script>
<template>
<ag-grid-vue style="width: 100%; height: 500px"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    @grid-ready="onGridReady"
    @row-editing-started="onRowEditingStarted"
    @row-editing-stopped="onRowEditingStopped"
    @cell-clicked="onCellClicked"
    :rowData="rowData"
    :defaultColDef="defaultColDef"
    :editType="editType"
    :suppressClickEdit="suppressClickEdit">
</ag-grid-vue>
</template>
<style lang='scss'>
    @import "~ag-grid-community/dist/styles/ag-grid.css";
    @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
    .action-button {
        padding: 2px 20px;
        margin-right: 10px;
    }
    .pointer-events-none {
        pointer-events: none
    }
</style>