#require "random-word"
class WordController < ApplicationController

	def index
		@icon = Icon.new
		#@word = RandomWord.nouns.next 
		render :template => "icons/edit"
	end

end
