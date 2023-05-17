FROM python:3.9

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY ./backend /server/backend

EXPOSE 8000

CMD ["uvicorn","backend.cruds:app","--host","0.0.0.0","--port","8000"]
