# dev hint: shotgun login.rb

require 'rubygems'
require 'sinatra'
require 'bigcommerce'
require 'json'
require 'haml'
require 'pp'


configure do
	set :public_folder, Proc.new { File.join(root, "static") }
end

store_url = 'https://store-bwvr466.mybigcommerce.com'
api_key = '567df000b3e5c0a203f42666531e16ed'
api_user = 'testuser'
api = BigCommerce::Api.new({
		:store_url => store_url,
		:username => api_user,
		:api_key => api_key
	})


get '/' do
	haml :home
end

post '/load' do
	if !params["url"].nil? and params["url"].length > 1
		store_url = params["url"]
	end
	if !params["key"].nil? and params["key"].length > 1
		api_key = params["key"]
	end
	if !params["user"].nil? and params["user"].length > 1
		api_user = params["user"]
	end
	api = BigCommerce::Api.new({
		:store_url => store_url,
		:username => api_user,
		:api_key => api_key
	})
 content_type :json
	 {:status => "200"}.to_json

end

get '/dashboard' do
	
	@dates = []
	@amount = []
	demographics = []
	
	orders = api.get_orders
	@dates = orders.collect{|o| o["date_created"]}
	@amount = orders.collect{|o| Float(o["subtotal_inc_tax"])}
	demographics = orders.collect{|o| o["billing_address"]["state"]}
	@pie = [] 
	a = Hash.new{|h,k| h[k] = 0}
	demographics.each do |d|
		a[d] = a[d] + 1
	end
	
	a.keys.each do |k|
		@pie << [k,a[k]]
	end
	
	haml :dashboard 
end

 

 
