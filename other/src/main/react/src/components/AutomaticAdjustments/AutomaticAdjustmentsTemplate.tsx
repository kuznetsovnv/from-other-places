import * as React from 'react'
import {observer} from 'mobx-react'
import { Table } from 'reactstrap';
import {AdjustmentsStore} from '../../../store/Settings/AdjustmentsStore'
import {AdjustmentsFetcher} from '../../../fetcher/Settings/AdjustmentsFetcher'
import {Loader} from '../../Loader/Loader'
import {ErrorBlock} from '../../ErrorBlock/ErrorBlock'
import {Input} from "../../Input/Input";
import * as s from './AutomaticAdjustmentsTemplate.scss'
import {FieldFormat} from "../../../const/ReportForm/Field";

interface IAutomaticAdjustmentsTemplateProps {
    title: string,
    adjustmentsType: string
}

@observer
class AutomaticAdjustmentsTemplate extends React.Component<IAutomaticAdjustmentsTemplateProps> {
    props: IAutomaticAdjustmentsTemplateProps
    adjustmentsFetcher: AdjustmentsFetcher
    adjustmentsStore: AdjustmentsStore

    componentWillMount () {
        this.adjustmentsStore = new AdjustmentsStore()

        this.adjustmentsFetcher = new AdjustmentsFetcher({
            adjustmentsStore: this.adjustmentsStore,
            adjustmentsType: this.props.adjustmentsType,
        })

        this.adjustmentsFetcher.loadAdjustments()
    }

    inputOptions = {
        format: FieldFormat.PERCENT_WITH_NEGATIVE_VALUE
    }

    render () {
        const store = this.adjustmentsStore
        const fetcher = this.adjustmentsFetcher

        return (
            <div className={s.root}>
                <h1>
                    Корректировка на "{this.props.title}", %
                    {store.isSaving ? <Loader inner /> : null}
                </h1>
                <div>
                    {(
                        store.loading ? <Loader /> :
                            store.loadError ?
                                <ErrorBlock message={store.loadError} reload={fetcher.loadAdjustments} />
                                :
                                <div>
                                    <Table striped className={s.table}>
                                        <thead>
                                        <tr>
                                            <th>Объект оценки \ аналог</th>
                                            {store.titles.map((title, index) =>
                                                <th key={title}>{title}</th>,
                                            )}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {store.adjustments.map((adj, index) =>
                                            <tr key={store.titles[index]}>
                                                <th scope="row">{store.titles[index]}</th>
                                                {adj.map((val, index2) =>
                                                    <td key={index2}>
                                                        {index > index2 ?
                                                            <Input className={s.mini_input} store={store} path={`adjustments.${index}.${index2}`} options={this.inputOptions}/> :
                                                            index === index2 ? 0 : -store.adjustments[index2][index]
                                                        }
                                                    </td>
                                                )}
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                    <input type="button" className='btn btn-primary' onClick={fetcher.saveAdjustments} value="Сохранить"/>
                                </div>
                    )}
                </div>

            </div>
        )
    }
}

export {AutomaticAdjustmentsTemplate}
