import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AppService from 'App/Models/AppService';

export default class AppSettingsController {
    public async get({ view }: HttpContextContract) {
        const androidAppSettings = await AppService.query().where('type', 'android').first();
        const iOSAppSettings = await AppService.query().where('type', 'ios').first();
        return view.render('app_services', {
            page_name: 'App Settings',
            android: androidAppSettings?.serialize(),
            ios: iOSAppSettings?.serialize(),
        });
    }
    public async updateAndroidSettings({ request, response }: HttpContextContract) {

        const requestData = request.only([ 'app_ver', 'is_force_update', 'is_under_maintenance' ]);
        const androidAppSettings = await AppService.query().where('type', 'android').first();
        if (!androidAppSettings) {
             return response.redirect().toRoute('admin_app_settings');

            return response.status(500).json({
                status: false,
                error: "Entery not found.",
                data: null,

            });

        }
        androidAppSettings.version = requestData.app_ver;
        androidAppSettings.is_force_update = requestData.is_force_update === 'on' ? true : false;
        androidAppSettings.is_under_maintenance = requestData.is_under_maintenance === 'on' ? true : false;

        androidAppSettings.save();

        return response.redirect().toRoute('admin_app_settings');

        return response.status(200).json({
            status: true,
            message: "Settings updated successfully.",
            data: [],

        })
    }

    // TODO: versions should go up not down
    public async updateIOSSettings({ request, response }: HttpContextContract) {

        const requestData = request.only([ 'app_ver', 'is_force_update', 'is_under_maintenance' ]);
        const iOSAppSettings = await AppService.query().where('type', 'ios').first();

        if (!iOSAppSettings) {
            return response.redirect().toRoute('admin_app_settings');

            return response.status(500).json({
                status: false,
                error: "Entery not found.",
                data: null,

            });

        }
        iOSAppSettings.version = requestData.app_ver;
        iOSAppSettings.is_force_update = requestData.is_force_update === 'on' ? true : false;
        iOSAppSettings.is_under_maintenance = requestData.is_under_maintenance === 'on' ? true : false;

        iOSAppSettings.save();

        return response.redirect().toRoute('admin_app_settings');

        return response.status(200).json({
            status: true,
            error: "Settings updated successfully.",
            data: [],

        })
    }
}