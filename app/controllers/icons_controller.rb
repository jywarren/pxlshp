class IconsController < ApplicationController

	def index
		@icons = Icon.find :all, :order => "id DESC"
	end

	def edit
		@icon = Icon.find(params[:id])
	end

	def save
		@icon = Icon.find(params[:id])
		@icon.image_data = params[:image_data]
		@icon.version = @icon.version+1
		@icon.save
		render :text => "Saved!"
	end

	def create
		@icon = Icon.new({:name => params[:icon][:name]})
		@icon.save
		redirect_to "/icon/"+@icon.id.to_s
	end

end
