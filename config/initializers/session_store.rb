# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_pxlshp_session',
  :secret      => 'ebb45b0b30c65dc0bd37c75c128cde81ad01f2e0de96928b694892a13c639d3fe5a7ece4b684b09b617fb192697f92d6edbc3585b5d170faae9fa5c204abb1b8'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
