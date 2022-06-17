export default class HtmlMarkupHelper {
	public static getSuccessMarkup(value: string, modelID = 'update-status-modal'): string {
		return `
			<span
				class="table-status-update btn btn-success btn-rounded waves-effect waves-light"
				data-toggle="modal"
				data-target="#table-${modelID}"
				>
				${value}
			</span>
		`;
	}

	public static getDangerMarkup(value: string, modelID = 'update-status-modal'): string {
		return `
			<span
				class="table-status-update btn btn-danger btn-rounded waves-effect waves-light"
				data-toggle="modal"
				data-target="#table-${modelID}"
				>
				${value}
			</span>
		`;
	}

	public static getWarningMarkup(value: string, modelID = 'update-status-modal'): string {
		return `
			<span
				class="table-status-update btn btn-warning btn-rounded waves-effect waves-light"
				data-toggle="modal"
				data-target="#table-${modelID}"
				>
				${value}
			</span>
		`;
	}

	public static getImageMarkup(path: string): string {
		return `
			<div class="avtar-sm">
                <img
                    src="${path}"
                    style="max-height: 100px;"
                    />
            </div>
		`;
	}

	public static getEditBtnMarkup(iconName = 'mdi mdi-pencil'): string {
		return `
			<button
				class="table-update-row btn btn-success btn-xs btn-icon"
				data-toggle="modal" data-target="#table-update-modal"
			>
				<i class="${iconName}"></i>
			</button>
		`;
	}

	public static getEditBtnLinkMarkup(href: string, iconName = 'mdi mdi-pencil'): string {
		return `
			<a
				class="table-update-row btn btn-success btn-xs btn-icon"
				href="${href}"
			>
				<i class="${iconName}"></i>
			</a>
		`;
	}

	public static getDeleteBtnMarkup(iconName = 'mdi mdi-delete'): string {
		return `
			<button  class="table-delete-row btn btn-danger btn-xs btn-icon">
				<i class="${iconName}"></i>
			</button>
		`;
	}
}
