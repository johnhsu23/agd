# The stage to use
set :stage, :dev

# An array containing site URL, used for Varnish bans
set :site_url, %w{ets-arts-2016.dev.forumone.com}

# An array containing drupal sites to copy settings files in
set :site_folder, %w{default}

# The directory where the webroot
set :webroot, 'public'

# The path to the project on the server
set :deploy_to, '/var/www/vhosts/ets-arts-2016.dev'

# Where the temporary directory is
set :tmp_dir, fetch(:deploy_to)

# Which branch to deploy
set :branch, "master"

# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary
# server in each group is considered to be the first
# unless any hosts have the primary property set.
role :app, %w{ets-arts-2016@dev.forumone.com}, :primary => true
role :web, %w{ets-arts-2016@dev.forumone.com}
role :db,  %w{ets-arts-2016@dev.forumone.com}

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server
# definition into the server list. The second argument
# something that quacks like a has can be used to set
# extended properties on the server.
# server 'example.com', user: 'deploy', roles: %w{web app}, my_property: :my_value

# you can set custom ssh options
# it's possible to pass any option but you need to keep in mind that net/ssh understand limited list of options
# you can see them in [net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start)
# set it globally
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
# and/or per server
# server 'example.com',
#   user: 'user_name',
#   roles: %w{web app},
#   ssh_options: {
#     user: 'user_name', # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: 'please use keys'
#   }
# setting per server overrides global ssh_options

# fetch(:default_env).merge!(:rails_env, :dev)
