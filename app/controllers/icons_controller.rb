class IconsController < ApplicationController

  def index
    @icons = Icon.all.order("id DESC").where(mode: 'bw')
  end

  def index_color 
    @icons = Icon.all.order("id DESC").where(mode: 'color')
    @color = true
    render :template => "icons/index"
  end

  def offline
  end

  def edit
    @icon = Icon.find(params[:id])
    @color = @icon.mode == 'color'
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
    @icon.mode = params[:mode] || "bw"
    @icon.save!
    if params[:image_data]
      if params[:external]
        redirect_to "/icon/"+@icon.id.to_s
      else
        render :text => @icon.id
      end
    else
      redirect_to "/icon/"+@icon.id.to_s
    end
  end

end
