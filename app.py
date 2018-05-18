import datetime as dt
import numpy as np
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite" )
Base = automap_base()
Base.prepare(engine, reflect= True)

session = Session(bind = engine)
Base = automap_base()
Base.prepare(engine, reflect=True)
inspector = inspect(engine)

OTU = Base.classes.otu   
samples = Base.classes.samples
samples_metadata = Base.classes.samples_metadata

app = Flask(__name__)

@app.route("/")
    
def index():

    
    return render_template('index.html')



@app.route('/names')
def names():

    columns = inspector.get_columns('samples')
    sample_name = []
    for column in columns:
        sample_name.append(column["name"])

    return jsonify(sample_name[1:])


@app.route('/otu/<sample>')
def otu(sample):

    id = pd.read_csv("DataSets/belly_button_biodiversity_otu_id.csv", index_col='otu_id' )
    samples= pd.read_csv("DataSets/belly_button_biodiversity_samples.csv",  index_col='otu_id' )    
    samples = samples.fillna(0)
    samples = samples.sort_values(sample, ascending= False)
    merged = samples.merge(id, how = "left", left_index = True, right_index = True)

    discription = [cell for cell in merged['lowest_taxonomic_unit_found']]
    

    return jsonify(discription)


@app.route('/metadata/<sample>')
def metadata(sample):

            sample = int(sample.split("_")[1])
            results = session.query(samples_metadata.AGE, samples_metadata.BBTYPE,
                                    samples_metadata.ETHNICITY, samples_metadata.GENDER, 
                                    samples_metadata.LOCATION, samples_metadata.SAMPLEID).filter(samples_metadata.SAMPLEID == sample).all()
            result = list(results)
            # result = results[0]
            metadata_list = {}
            for r in results:
                metadata_list = {
                "Age" : r[0],
                "BBType" : r[1],
                "Ethnicity" : r[2],
                "Gender" : r[3],
                "Location" : r[4],
                "SampleID" : r[5]
                }
            return jsonify(metadata_list)



@app.route('/wfreq/<sample>')

def wfreq_samp(sample):

    sampleID=(sample.split("_")[1])
    results = session.query(samples_metadata.WFREQ).\
        filter(samples_metadata.SAMPLEID == sampleID).first()
    for result in results:
        wfreq = int(result)
    
    return jsonify(wfreq)


@app.route('/samples/<sample_name>')
def samples(sample_name):
    # Query specified sample field + otu_id from the 'samples' table
    query_values = f"SELECT {sample_name}, otu_id FROM samples ORDER BY {sample_name} DESC"
    data = engine.execute(query_values).fetchall()

    # Create lists of values and otu_id's
    values = [item[0] for item in data]  
    otus = [item[1] for item in data]

    # Place the lists into an object
    otus_and_values = {"otu_ids": otus, "sample_values": values}

    # Return jsonified list
    return jsonify(otus_and_values)

  
# by using pandas in csv sheets
# @app.route('/samples/<sample>')
# def samp_samp(sample):
#     samples= pd.read_csv("DataSets/belly_button_biodiversity_samples.csv" )
#     samples = samples.fillna(0)
#     samples = samples.sort_values(sample, ascending= False)
#     out_id = [cell for cell in samples['otu_id']]
#     sample_values = [cell for cell in samples[sample]]
#     returned_list= {
#             'otu_ids' : out_id,
#             'sample_values' : sample_values
#         }

#     return jsonify(returned_list)


if __name__ == "__main__":
    app.run(debug=True)

    