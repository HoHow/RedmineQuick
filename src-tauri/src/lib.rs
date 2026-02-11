mod commands;
mod config;
mod redmine;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
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
            commands::issues::download_attachment,
            commands::issues::save_attachment,
            commands::time_entries::create_time_entry,
            commands::time_entries::list_activities,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
