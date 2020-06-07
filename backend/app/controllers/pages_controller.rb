class PagesController < ApplicationController
  def hello
    render plain: request.env
                    .select { |key, _| key =~ /\AHTTP_/ }
                    .map { |key, val| "#{key}: #{val}" }
                    .join("\n")
  end
end
