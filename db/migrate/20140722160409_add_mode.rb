class AddMode < ActiveRecord::Migration
  def self.up
    add_column :icons, :mode, :string, :default => 'bw'
  end

  def self.down
    remove_column :icons, :mode
  end
end
