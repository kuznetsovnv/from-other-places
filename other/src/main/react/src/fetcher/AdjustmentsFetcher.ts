import {action, runInAction} from 'mobx'
import {ajax} from 'fetcher/helpers/ajax'
import {AdjustmentsStore} from 'store/AdjustmentsStore'
import * as dest from 'const/AjaxDest'

interface IAdjustmentsProps {
    adjustmentsStore: AdjustmentsStore,
    adjustmentsType: string,
}

export class AdjustmentsFetcher {
    props: IAdjustmentsProps

    constructor (props: IAdjustmentsProps) {
        this.props = props
    }

    @action loadAdjustments = async () => {
        this.props.adjustmentsStore.loading = true
        this.props.adjustmentsStore.loadError = ''

        let response = await ajax({
            method: 'GET',
            url: dest.LOAD_AUTOMATIC_ADJUSTMENTS!,
            contentType: 'JSON',
            args: {
                adjustmentsType: this.props.adjustmentsType,
            },
        })
        if (response.error || !response.data) {
            await this.props.adjustmentsStore.receiveLoadError(response)
        } else {
            await this.props.adjustmentsStore.receiveAdjustments(response.data)
        }
    }

    @action saveAdjustments = async () => {
        this.props.adjustmentsStore.isSaving = true
        this.props.adjustmentsStore.saveError = ''
        let response = await ajax({
            method: 'POST',
            url: dest.SAVE_AUTOMATIC_ADJUSTMENTS!,
            jsonData: {
                adjustments: JSON.stringify(this.props.adjustmentsStore.adjustments),
                adjustmentsType: this.props.adjustmentsType
            },
        })
        runInAction(() => {
            this.props.adjustmentsStore.isSaving = false
            let message = 'Данные сохранены.'
            if (response.error) {
                let message = 'Ошибка отправки данных на сервер, попробуйте еще раз.'
                this.props.adjustmentsStore.saveError = message
            }
            setTimeout(() => {
                alert(message)
            }, 1)
        })
    }
}
