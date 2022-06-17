export type BoardTypeData = {
	id: number;
	value: string;
};

export type NewsCategoryData = {
	id: number;
	value: string;
};

export type IssueData = {
	id: number;
	value: string;
};
export type AddIssueArticle = {
	en_title: string;
	ar_title: string;
	name_en: string;
	name_ar: string;
	email: string;
	doi_link: string;
	page_no: string;
	issue_id: number;
	research_file: any;
	ar_description: string;
	en_description: string;
	is_approved: boolean;
};

export type AddCategory = {
	cat_name: string;
	image: any;
	status: boolean;
};

export type CategoryData = {
	id: number;
	value: string;
};

export type AddSubCategoryData = {
	id: number;
	subcat_name: string;
	category_id: number;
};