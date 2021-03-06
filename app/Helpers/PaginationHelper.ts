import { PaginationSearchData } from "App/Types";
export default class PaginationHelper {
	public static preparePaginationData(rawData: any): PaginationSearchData {
		const pageNo = rawData.start / rawData.length;
		const orderCoulmn = rawData.order[ 0 ].column;
		const paginationSearchData: PaginationSearchData = {
			current_page: pageNo,
			items_per_page: rawData.length,
			filter_options: {
				...rawData.filter_options,
				search: rawData.filter_options.search ? rawData.filter_options.search : ''
			},
			order_by: orderCoulmn,
			obrder_by_dir: rawData.order[ 0 ].dir
		};
		return paginationSearchData;
	}
}