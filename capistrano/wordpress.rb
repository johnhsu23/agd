# Revert the database when a rollback occurs
Rake::Task["deploy:rollback_release_path"].enhance do
  invoke "wordpress:revert_database"
end

# Backup the database when publishing a new release
Rake::Task["deploy:publishing"].enhance ["wordpress:dbbackup"]

namespace :wordpress do
  task :settings do
    on roles(:app) do
      if test " [ -f #{current_path}/public/wp-config.php ]"
        execute :rm, "-f", "#{current_path}/public/wp-config.php"
      end
      
      execute :ln, '-s', "#{current_path}/public/wp-config.#{fetch(:stage)}.php", "#{current_path}/public/wp-config.php"
        
      # If a .htaccess file for the stage exists
      if test " [ -f #{current_path}/public/htaccess.#{fetch(:stage)} ]"
        # If there is currently an .htaccess file
        if test " [ -f #{current_path}/public/.htaccess ]"
          execute :rm, "#{current_path}/public/.htaccess"
        end
        
        execute :ln, '-s', "#{current_path}/public/htaccess.#{fetch(:stage)}", "#{current_path}/public/.htaccess"
      end
    end
  end
  
  task :dbbackup do
    invoke "wpcli:dbexport"
  end
  
  desc "Revert the database"
  task :revert_database do
    on roles(:db) do
      within "#{release_path}/public" do
        execute :wp, "db import", "#{release_path}/db.sql"
      end
    end
  end
end