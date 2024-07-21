export enum ROUTE {
    LOGIN = '/log-in',
    DASHBOARD = '/dashboard',
    PROFILE = '/dashboard/profile',
    CHANGE_PASSWORD = '/dashboard/profile/change-password',
    USER = '/dashboard/user',
    ADD_USER = '/dashboard/user/add',
    INFO_USER = '/dashboard/user/info',
    CATEGORY = '/dashboard/category',
    ADD_CATEGORY = '/dashboard/category/add',
    EDIT_CATEGORY = '/dashboard/category/edit',
    UTILITY = '/dashboard/utility',
    ADD_UTILITY = '/dashboard/utility/add-utility',
    EDIT_UTILITY = '/dashboard/utility/edit-utility',
    PRODUCT = '/dashboard/product',
    ADD_PRODUCT = '/dashboard/product/add-product',
}

export enum UserRoleEnum {
    ADMIN = 'R1',
    MANAGER = 'R2',
    CUSTORMER = 'R3',
}