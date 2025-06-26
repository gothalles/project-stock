CREATE SCHEMA db_fld209111cet ;
USE db_fld209111cet;

CREATE TABLE tb_user (
	id 			INT				NOT NULL AUTO_INCREMENT,
	email		VARCHAR(100)	NOT NULL UNIQUE,
	password	VARCHAR(255) 	NOT NULL,
	fullname	VARCHAR(50)  	NOT NULL,
    create_on 	DATETIME 	  	NOT NULL,
	
	PRIMARY KEY (id ASC)
);

CREATE TABLE tb_product (
	id 			INT			NOT NULL AUTO_INCREMENT,
	type		VARCHAR(20)	NOT NULL,
	description	VARCHAR(50)	NOT NULL,
    create_by 	INT 	 	NOT NULL,
    create_on 	DATETIME 	NOT NULL,
    change_by 	INT 		NULL,
    change_on 	DATETIME	NULL,
	
    PRIMARY KEY (id ASC),
    CONSTRAINT product_create_by   FOREIGN KEY (create_by)   REFERENCES tb_user (id),
    CONSTRAINT product_change_by   FOREIGN KEY (change_by)   REFERENCES tb_user (id)
);

CREATE TABLE tb_gm_header (
	id 			INT			NOT NULL AUTO_INCREMENT,
	type		VARCHAR(1)	NOT NULL,
	description	VARCHAR(50)	NOT NULL,
    create_by 	INT 	 	NOT NULL,
    create_on 	DATETIME 	NOT NULL,
	
    PRIMARY KEY (id ASC),
    CONSTRAINT gm_header_create_by   FOREIGN KEY (create_by)   REFERENCES tb_user (id)
);

CREATE TABLE tb_gm_item (
	id 			INT				NOT NULL,
	item		INT				NOT NULL,
	product		INT				NOT NULL,
	quantity	DECIMAL(13,3) 	NOT NULL,
	
    PRIMARY KEY (id ASC),
	CONSTRAINT gm_item_id          FOREIGN KEY (id)          REFERENCES tb_gm_header (id),
    CONSTRAINT gm_item_product     FOREIGN KEY (product)     REFERENCES tb_product (id)
);

CREATE VIEW vw_stock AS
	SELECT
	product.id AS product,
	product.description,
	IFNULL(SUM(IF(header.type = "E", item.quantity, (item.quantity * -1))), 0) AS balance
	FROM tb_product        AS product
	LEFT JOIN tb_gm_item  AS item 
	   ON item.product = product.id
	LEFT JOIN tb_gm_header AS header
	   ON header.id = item.id
	GROUP BY product.id;

INSERT INTO `tb_user` (`email`, `password`, `fullname`, `create_on`) VALUES ('admin@admin.com', ' ', 'Administrador', now());

INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Eletrônicos', 'Smartphone', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Eletrônicos', 'Notebook', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Eletrônicos', 'Fone de Ouvido Bluetooth', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Eletrônicos', 'Smart TV', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Moda', 'Camiseta Básica', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Moda', 'Calça Jeans', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Moda', 'Tênis Esportivo', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Moda', 'Vestido Elegante', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Casa e Decoração', 'Jogo de Lençol', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Casa e Decoração', 'Luminária de Mesa', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Casa e Decoração', 'Panela de Pressão', '1', now());
INSERT INTO `tb_product` (`type`, `description`, `create_by`, `create_on`) VALUES ('Casa e Decoração', 'Vaso Decorativo', '1', now());
