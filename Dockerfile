# Usamos la imagen oficial de Node.js
FROM node:21

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código del proyecto al contenedor
COPY . .

# Exponemos el puerto en el que correrá la aplicación (3010 en este caso)
EXPOSE 3010

# El comando que ejecutará el contenedor (npm start usará lo que tengas definido en tu package.json)
CMD ["npm", "start"]
