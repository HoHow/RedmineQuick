mod commands;
mod config;
mod polling;
mod redmine;
mod tray;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            commands::connection::test_connection,
            commands::connection::save_config,
            commands::connection::load_config,
            commands::projects::list_projects,
            commands::issues::list_my_issues,
            commands::issues::list_project_issues,
            commands::issues::get_issue,
            commands::issues::create_issue,
            commands::issues::update_issue,
            commands::issues::list_trackers,
            commands::issues::list_statuses,
            commands::issues::list_priorities,
            commands::issues::list_memberships,
            commands::issues::upload_attachment,
            commands::issues::get_file_metadata,
            commands::issues::download_attachment,
            commands::issues::save_attachment,
            commands::time_entries::create_time_entry,
            commands::time_entries::list_activities,
        ])
        .setup(|app| {
            // System Tray
            tray::setup_tray(app)?;

            // 攔截視窗關閉 → 隱藏而非退出
            let window = app.get_webview_window("main").unwrap();
            let window_clone = window.clone();
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window_clone.hide();
                }
            });

            // 背景 Polling
            polling::start_polling(app.handle().clone());

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Reopen {
            has_visible_windows,
            ..
        } = &_event
        {
            if !has_visible_windows {
                if let Some(window) = _app_handle.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
    });
}
