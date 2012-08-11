class IconsController < ApplicationController

	def index
		@icons = Icon.find :all, :order => "id DESC"
	end

	def offline

	end

	def edit
		@icon = Icon.find(params[:id])
	end

	def color
		@icon = Icon.new
		render :template => "icons/color"
	end

	def hash
		render :template => "icons/edit"
	end

	def save
		@icon = Icon.find(params[:id])
		@icon.image_data = params[:image_data]
		@icon.version = @icon.version+1
		@icon.save!
		render :text => "Saved!" 
	end

	def new
		@icon = Icon.new
		render :template => "icons/edit"
	end

	def create
		#name = params[:icon][:name]
		#name = "" if name == "Name (optional)"
		name = ""
		@icon = Icon.new({:name => name})
		@icon.image_data = params[:image_data] || ""
		@icon.save!
		if params[:image_data]
			render :text => @icon.id
		else
			redirect_to "/icon/"+@icon.id.to_s
		end
	end

end
