#!/usr/bin/env ruby
# Generate new entries for QR labels to be filled in manually later
# Program does:
# * Create a CSV file with NP numbers and UUIDs.
# * Create the corresponding entries in the database.
#
# Author: srldl
#
# Requirements:
#
########################################

require '../config'
require '../server'
require 'net/http'
require 'net/ssh'
#require 'net/scp'
require 'time'
require 'date'
require 'json'
require 'simple-spreadsheet'


module Couch

  class GenerateGeologyLabels

    #Get hold of UUID for database storage
    def self.getUUID(server)

       #Fetch a UUID from couchdb
       res = server.get("/_uuids")


       #Extract the UUID from reply
       uuid = (res.body).split('"')[3]

       #Convert UUID to RFC UUID
       uuid.insert 8, "-"
       uuid.insert 13, "-"
       uuid.insert 18, "-"
       uuid.insert 23, "-"
       return uuid
    end

    #Get a timestamp - current time
    def self.timestamp()
       a = (Time.now).to_s
       b = a.split(" ")
       c = b[0].split("-")
       dt = DateTime.new(c[0].to_i, c[1].to_i, c[2].to_i, 12, 0, 0, 0)
       return dt.to_time.utc.iso8601
    end


    #Get date, convert to iso8601
    #Does not handle chars as month such as 6.june 2015 etc
    #Does not handle day in the middle, such as 04/23/2014 etc
    def self.iso8601time(inputdate)
       a = (inputdate).to_s
       #puts "a " + a

       #Delimiter space, -, .,/
       b = a.split(/\.|\s|\/|-/)
       #Find out where the four digit is, aka year
       if b[0].size == 4 #Assume YYYY.MM.DD
             dt = DateTime.new(b[0].to_i, b[1].to_i, b[2].to_i, 12, 0, 0, 0)
       elsif b[2].size == 4  #Assume DD.MM.YYYY
            # puts b
            # puts "here's b"
             dt = DateTime.new(b[2].to_i, b[1].to_i, b[0].to_i, 12, 0, 0, 0)
       else
             puts "cannot read dateformat"
       end
             return dt.to_time.utc.iso8601
    end

     #Set server
    host = Couch::Config::HOST1
    port = Couch::Config::PORT1
    user = Couch::Config::USER1
    password = Couch::Config::PASSWORD1


    COUCH_DB_NAME = "geology-sample"

    #Start NPnumber (all numbers including start and end will be generated)
    startNPno = 1
    endNPno = 10

    #Get ready to put into database
    server = Couch::Server.new(host, port)

    #Loop for the new number of labels
    for x in startNPno..endNPno


      #Generate UUID
      @uuid = getUUID(server)
      puts @uuid

      #Generate NP number from NPno
      @noLength = (x.to_s).length
      @zeros = 5-@noLength
      @NPnumb = "NP" + ("0"*@zeros) + x.to_s

      @timestamp = timestamp()


      #Write to database, include draft='yes'
      @entry =
            {
             :id => @uuid,
             :_id => @uuid,
             :schema => "http://api.npolar.no/schema/geology-sample",
             :title => @NPnumb,
             :lang => "en",
             :draft => "yes",
             :position_accuracy => "good estimate",
             :collection => "geology-sample",
             :base =>  "http://api.npolar.no",
             :created => @timestamp,
             :created_by => "siri.uldal@npolar.no",
             :updated => @timestamp,
             :updated_by => "siri.uldal@npolar.no"
      }

      #remove nil values
      # @entry.reject! {|k,v| v.nil?}

      #Post coursetype
      doc = @entry.to_json
      puts doc

      res2 = server.post("/geology-sample/", doc, user, password)
      puts res2

      #Write NPnumb and UUID back to file
      text = @NPnumb + ' ' + @uuid + "|"
      begin
        inputfile = 'NPnumbers-UUID.txt'
        file = File.open(inputfile, 'a') { |f| f.write(text) }
      rescue IOError => e
          #some error occur, dir not writable etc.
          puts "error occurred - did not write to file"
      end

    end #for


  end
end
