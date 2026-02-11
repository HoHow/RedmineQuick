mod commands;
mod config;
mod redmine;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            greet,
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
