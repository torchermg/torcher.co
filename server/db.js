import sqlite3 from "sqlite3";
import { open } from "sqlite";

export let db;

export const setup = async function setup(path) {
	db = await open({
		filename: path,
		driver: sqlite3.Database
	});
	db.exec(`
		CREATE TABLE IF NOT EXISTS torcher_user (
			email CITEXT PRIMARY KEY UNIQUE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			name TEXT NOT NULL,
			wants_marketing BOOLEAN NOT NULL
		);

		CREATE TABLE IF NOT EXISTS torcher_order (
			id CITEXT PRIMARY KEY,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			email CITEXT NOT NULL,
			braintree_transaction_id INT UNIQUE NOT NULL,
			discount INT NOT NULL,
			subtotal INT NOT NULL,
			total INT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS torcher_order_item (
			id CITEXT PRIMARY KEY UNIQUE NOT NULL,
			order_id INT NOT NULL,
			production_id TEXT NOT NULL,
			license_id TEXT NOT NULL,
			price INT NOT NULL
		);
	`);
	return db;
};
