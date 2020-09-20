use db_cherry;

select * from tipos;
select * from usuarios;
select * from produtos;
select * from vendas;
select * from produtos_vendidos;

select v.*, p.quantidade, p.valor_unit, p.produto_id from vendas v INNER JOIN produtos_vendidos p ON p.venda_id = v.id