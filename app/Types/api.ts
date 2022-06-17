export type IssuesData = {
	id: number;
	name: string;
	year: string;
};

export type SubCategoryData = {
	id: number;
	category_id: number;
	subcat_name: string;
	category_name : string;
};

export type IssueArticlesData = {
	id: number;
	title: string;
	description: string;
	doi_link: string;
	page_no: string;
	issue_id: number;
	issue: string;
	author: string;
	created_at: string;
	read_count: number;
	download_count: number;
	download_link: string;
};

export type IssueArticleData = {
	id: number;
	title: string;
	issue: string;
	issue_cover_img: string;
	description: string;
	author: string;
	created_at: string;
	read_count: number;
	download_count: number;
	download_link: string;
};

export type IndexData = {
	name: string;
	img_url: string;
	redirect_url: string;
};

export type BoardMember = {
	name: string;
	info: string;
	email: string;
};

export type NewsCategoriesData = {
	id: number;
	name: string;
	about: string;
};

export type NewsArticlesData = {
	id: number;
	title: string;
	img_url: string;
	description: string;
	created_at: string;
	author: string;
};

export type NewsArticleData = {
	id: number;
	title: string;
	category_id: number;
	img_url: string;
	description: string;
	content: string;
	created_at: string;
	author: string;
};

export type FAQData = {
	que: string;
	ans: string;
};

export type AboutJournalData = {
	about: string;
	message: string;
	goal: string;
	vision: string;
	values: string;
};

export const NEWS_ARTICLE_DATE_FORMAT = 'dd LLL yyyy';
export const ISSUE_ARTICLE_DATE_FORMAT = 'yyyy-LL-dd';

export type DashboardIssueArticleData = {
	id: number;
	title: string;
	issue: string;
	author: string;
	status: boolean;
	created_at: string;
	read_count: number;
	download_count: number;
	download_link: string;
};

export type IssueArticlesStatistics = {
	total: number;
	approved: number;
	not_approved: number;
	last_month: number;
	this_month: number;
};

export type NewsArticlesStatistics = {
	total: number;
	published: number;
	not_published: number;
	last_month: number;
	this_month: number;
};

export type DatabaseBackupFileList = string[];
