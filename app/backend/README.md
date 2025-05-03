# Backend documentation
Here is the entire backend documentation.

## Notebook for predicting heart disease using logistic regression.

The notebook begins by pulling the dataset from Kaggle using `kagglehub` and loading the `heart.csv` file, which contains 1025 rows and 14 columns. 📊 After inspecting the data, we confirmed there were no missing values 🎉. Next, we applied one-hot encoding to categorical columns like `cp`, `restecg`, `slope`, and `thal` to make them machine-readable 🔧. We then standardized the features using `StandardScaler` to ensure they all had the same scale ⚖️. The data was split into a 90/10 train-test ratio, and a `LogisticRegression` model was trained on the data. The model achieved an accuracy of around 78.6% on the test set 📈.
