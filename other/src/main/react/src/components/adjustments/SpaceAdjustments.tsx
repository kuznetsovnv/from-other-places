import * as React from 'react'
import {observer} from 'mobx-react'
import {
  BootstrapTable,
  TableHeaderColumn,
  ButtonGroup,
  InsertModalHeader,
  InsertModalFooter
} from 'react-bootstrap-table'

import {SpaceAdjustmentsFetcher} from 'fetcher/SpaceAdjustmentsFetcher'
import {SpaceAdjustmentsStore} from 'store/SpaceAdjustmentsStore'
import {Loader} from 'components/Loader/Loader'
import {ErrorBlock} from 'components/ErrorBlock/ErrorBlock'

import * as s from './SpaceAdjustments.scss'
import {action, computed} from 'mobx'


function customConfirm (next, dropRowKeys) {
  const dropRowKeysStr = dropRowKeys.join(', ')
  if (confirm(`Вы уверены что хотите удалить ${dropRowKeysStr}?`)) {
    // If the confirmation is true, call the function that
    // continues the deletion of the record.
    next()
  }
}

function intValidator (value, row) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } }
  if (!value || !Number.isInteger(Number(value))) {
    response.isValid = false
    response.notification.type = 'error'
    response.notification.msg = 'Значение должно быть целым числом!'
    response.notification.title = 'Ошибка валидации!'
  }
  return response
}

function editableFormatter (cell, row) {
  return `<i class='fa fa-pencil-square-o'></i> ${cell}`
}


@observer
class SpaceAdjustments extends React.Component {
  spaceAdjustmentsFetcher: SpaceAdjustmentsFetcher
  spaceAdjustmentsStore: SpaceAdjustmentsStore

  componentWillMount () {
    this.spaceAdjustmentsStore = new SpaceAdjustmentsStore()

    this.spaceAdjustmentsFetcher = new SpaceAdjustmentsFetcher({
      spaceAdjustmentsStore: this.spaceAdjustmentsStore
    })

    this.spaceAdjustmentsFetcher.loadAdjustments()
  }

  customKeyValidation = (value, row) => {
    let response = intValidator(value, row)
    if (!response.isValid) return response;

    if (Math.sign(value) === -1) {
      response.isValid = false
      response.notification.type = 'error'
      response.notification.msg = 'Значение должно быть положительным числом!'
      response.notification.title = 'Ошибка валидации!'
    }

    if (this.spaceAdjustmentsStore.adjustments.find(adj => {return Number(value) === adj.space})) {
      response.isValid = false
      response.notification.type = 'error'
      response.notification.msg = 'Разница в площади ' + value + '% уже существует!'
      response.notification.title = 'Ошибка валидации!'
    }
    return response;
  }

  customButtonGroup = props => {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
        { props.insertBtn }
        { props.deleteBtn }
        <button type='button' className={ `btn btn-primary` } onClick={ this.spaceAdjustmentsFetcher.saveAdjustments }>
          Сохранить
        </button>
      </ButtonGroup>
    )
  }

  customModalHeader = (closeModal, save) => {
    return (
      <InsertModalHeader
        title='Добавить'
        hideClose={ true }/>
    )
  }
  customModalFooter = (closeModal, save) => {
    return (
      <InsertModalFooter
        saveBtnText='Сохранить'
        closeBtnText='Отмена'/>
    )
  }

  addAdjustment = (adjustment) => {
    this.spaceAdjustmentsStore.addAdjustment(Number(adjustment.space), Number(adjustment.adjustment))
  }

  handleChangeIsSpaceAdjustmentsEnabled = (event) => {
    this.spaceAdjustmentsStore.setIsSpaceAdjustmentsEnabled(event.target.checked)
  }

  @action cellEdit = (adjustment, field, value) => {
    adjustment[field] = value;
  }

  cellEditProp = {
    mode: 'click',
    blurToSave: true,
  }

  selectRowProp = {
    mode: 'checkbox',
  }

  @computed get tableOptions () {
    return {
      handleConfirmDeleteRow: customConfirm,
      onAddRow: this.addAdjustment,
      onDeleteRow: this.spaceAdjustmentsStore.removeAdjustment,
      onCellEdit: this.cellEdit,
      btnGroup: this.customButtonGroup,
      insertModalHeader: this.customModalHeader,
      insertModalFooter: this.customModalFooter,
      insertText: 'Добавить',
      deleteText: 'Удалить',
      defaultSortName: 'space',  // default sort column name
      defaultSortOrder: 'asc',  // default sort order
    }
  }

  remote(remoteObj) {
    // Only cell editing, insert and delete row will be handled by remote store
    remoteObj.cellEdit = true;
    remoteObj.insertRow = true;
    remoteObj.dropRow = true;
    return remoteObj;
  }

  render () {
    const store = this.spaceAdjustmentsStore
    const fetcher = this.spaceAdjustmentsFetcher

    return (
      <div className={s.root}>
        <h1>
          Корректировка на общую площадь
          {store.isSaving ? <Loader inner /> : null}
        </h1>
        <div>
          {(
            store.loading ? <Loader /> :
            store.loadError ? <ErrorBlock message={store.loadError} reload={fetcher.loadAdjustments} /> :
            <div>
              <BootstrapTable
                data={this.spaceAdjustmentsStore.adjustments}
                cellEdit={this.cellEditProp}
                selectRow={this.selectRowProp}
                options={this.tableOptions}
                remote={this.remote}
                insertRow
                deleteRow
                striped
                hover
                condensed
              >
                <TableHeaderColumn
                  dataField='space'
                  editable={{validator: this.customKeyValidation}}
                  isKey
                  width='50%'
                >
                  Разница в площади Объекта оценки и аналога, %
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='adjustment'
                  editable={{validator: intValidator}}
                  dataFormat={editableFormatter}
                  columnTitle='Изменить'
                >
                  Корректировка, %
                </TableHeaderColumn>
              </BootstrapTable>
              <br/>
              <label>
                <b>Включить автоматический расчет </b>
                <input
                  type="checkbox"
                  checked={store.isSpaceAdjustmentsEnabled}
                  onChange={this.handleChangeIsSpaceAdjustmentsEnabled} />
              </label>
              <br/>
              <div>
                <p>Таблица автоматических корректировок не попадают в отчёт и используется только для ускорения заполнения данных.</p>
                <p>Пример расчёта при площади квартиры равном 50 кв.м:</p>
                {
                  this.spaceAdjustmentsStore.adjustments
                    .sort((a,b) => {return a.space > b.space})
                    .map(function(object, i){
                      return <div key={object.space}>
                        - Площадь аналога больше {(50 * (1 + object.space / 100)).toFixed(1)}, корректировка равна {object.adjustment}%.
                      </div>
                  })
                }
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export {SpaceAdjustments}
