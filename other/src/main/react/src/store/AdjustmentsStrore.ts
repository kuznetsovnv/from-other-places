import {action, observable} from 'mobx'

import {IAjaxResponse} from 'fetcher/helpers/ajax'


export class AdjustmentsStore {
    @observable adjustments: any = []
    @observable titles: any = []
    @observable loading = false
    @observable loadError = ''
    @observable isSaving = false
    @observable saveError = ''


    @action receiveLoadError (response: IAjaxResponse) {
        this.loadError = response.error && response.error.message || 'Ошибка во время загрузки данных'
        this.loading = false
        this.setAdjustments([])
    }

    @action receiveAdjustments (data) {
        this.loadError = ''
        this.loading = false
        this.setAdjustments(data.adjustments)
        this.setTitles(data.titles)
    }

    @action setAdjustments (adjustments) {
        this.adjustments = adjustments || []
    }

    @action setTitles (titles) {
        this.titles = titles || []
    }
}
