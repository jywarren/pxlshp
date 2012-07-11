class CreateIcons < ActiveRecord::Migration
  def self.up

    create_table :icons do |t|

	t.string :name, :default => "", :null => false
	t.integer :size, :default => 32, :null => false
	t.integer :version, :default => 0, :null => false
	t.text :image_data, :default => "", :null => false, :limit => 4294967295

      t.timestamps
    end

  end

  def self.down
    drop_table :icons
  end
end
