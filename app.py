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

    return "this is a main page"
    #return render_template('index.html')



@app.route('/names')
def names():

    columns = inspector.get_columns('samples')
    sample_name = []
    for column in columns:
        sample_name.append(column["name"])

    return jsonify(sample_name[1:])


@app.route('/otu')
def otu():

    result = [r[0] for r in session.query(OTU.otu_id).all()]

    return jsonify(result)


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

    

@app.route('/samples/<sample>')
def samp_samp(sample):
    samples= pd.read_csv("DataSets/belly_button_biodiversity_samples.csv" )
    samples = samples.fillna(0)
    samples = samples.sort_values(sample, ascending= False)
    out_id = [cell for cell in samples['otu_id']]
    sample_values = [cell for cell in samples[sample]]
    returned_list= [{
            'otu_ids' : out_id,
            'sample_values' : sample_values
        }]

    return jsonify(returned_list)


if __name__ == "__main__":
    app.run(debug=True)

    