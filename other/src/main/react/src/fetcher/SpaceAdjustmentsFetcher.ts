import * as dest from 'const/AjaxDest'
import {action, runInAction} from 'mobx'
import {ajax} from 'fetcher/helpers/ajax'
import {SpaceAdjustmentsStore} from 'store/SpaceAdjustmentsStore'

interface ISpaceAdjustmentsProps {
  spaceAdjustmentsStore: SpaceAdjustmentsStore
}

export class SpaceAdjustmentsFetcher {
  props: ISpaceAdjustmentsProps

  constructor (props: ISpaceAdjustmentsProps) {
    this.props = props
  }

  @action loadAdjustments = async () => {
    this.props.spaceAdjustmentsStore.loading = true
    this.props.spaceAdjustmentsStore.loadError = ''

    let response = await ajax({
      method: 'GET',
      url: dest.LOAD_SPACE_ADJUSTMENTS!,
      contentType: 'JSON',
    })
    if (response.error || !response.data) {
      await this.props.spaceAdjustmentsStore.receiveLoadError(response)
    } else {
      await this.props.spaceAdjustmentsStore.receiveAdjustments(response.data)
    }
  }

  @action saveAdjustments = async () => {
    this.props.spaceAdjustmentsStore.isSaving = true
    this.props.spaceAdjustmentsStore.saveError = ''
    let response = await ajax({
      method: 'POST',
      url: dest.SAVE_SPACE_ADJUSTMENTS!,
      jsonData: {
        isSpaceAdjustmentsEnabled: this.props.spaceAdjustmentsStore.isSpaceAdjustmentsEnabled,
        adjustments: JSON.stringify(this.props.spaceAdjustmentsStore.adjustments),
      },
    })
    runInAction(() => {
      this.props.spaceAdjustmentsStore.isSaving = false
      let message = 'Данные сохранены.'
      if (response.error) {
        let message = 'Ошибка отправки данных на сервер, попробуйте еще раз.'
        this.props.spaceAdjustmentsStore.saveError = message
      }
      setTimeout(() => {
        alert(message)
      }, 1)
    })
  }
}
