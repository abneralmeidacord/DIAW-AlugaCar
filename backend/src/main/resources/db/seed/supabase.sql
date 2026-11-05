-- Execute no SQL Editor do Supabase do AlugaCar após criar as tabelas com schema.sql.
-- As contas de teste criadas por este script usam a senha demo123.
begin;

alter table alugacar.automoveis add column if not exists localidade varchar(120);
alter table alugacar.pedidos_aluguel add column if not exists localidade varchar(120);

create temporary table agentes_demo on commit drop as
select gen_random_uuid() as id, dados.*
from (values
    ('empresa@alugacar.demo', 'empresa', 'Aurora Mobilidade', '00.000.000/0000-01'),
    ('rotaminas@alugacar.demo', 'empresa', 'Rota Minas Rent', '00.000.000/0000-03'),
    ('viaverde@alugacar.demo', 'empresa', 'Via Verde Locações', '00.000.000/0000-04'),
    ('banco@alugacar.demo', 'banco', 'Banco Horizonte', '00.000.000/0000-02'),
    ('banco.serra@alugacar.demo', 'banco', 'Banco Serra', '00.000.000/0000-05'),
    ('banco.veredas@alugacar.demo', 'banco', 'Banco Veredas', '00.000.000/0000-06')
) as dados(login, perfil, nome, cnpj);

insert into alugacar.usuarios (id, login, senha_hash)
select id, login, '$2a$12$6iTa9ioGoxw04iYKtdGcFOulwKnsJCmLrDsOQiOE/y/DzJsxg1z9a'
from agentes_demo
on conflict do nothing;

-- Insere os perfis apenas para as contas criadas nesta execução.
insert into alugacar.agentes (id, razao_social, cnpj)
select u.id, d.nome, d.cnpj
from agentes_demo d
join alugacar.usuarios u on u.id = d.id and u.login = d.login;

insert into alugacar.empresas (id)
select a.id
from agentes_demo d
join alugacar.agentes a on a.id = d.id
where d.perfil = 'empresa';

insert into alugacar.bancos (id)
select a.id
from agentes_demo d
join alugacar.agentes a on a.id = d.id
where d.perfil = 'banco';

create temporary table frota_demo on commit drop as
select dados.*, e.id as proprietario_id
from (values
    ('porsche', 'AC-001', 2024, 'Porsche', '911 Carrera', 'DEMO-01', 'Premium', 'empresa@alugacar.demo', 890, 'Gasolina', 'Prata', 'Uma experiência à parte', 'Belo Horizonte, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/2024_Porsche_911_992_Carrera.jpg/960px-2024_Porsche_911_992_Carrera.jpg'),
    ('mercedes', 'AC-002', 2024, 'Mercedes-Benz', 'C 200', 'DEMO-02', 'Sedan', 'empresa@alugacar.demo', 429, 'Híbrido', 'Prata', 'Conforto em cada detalhe', 'Betim, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg'),
    ('volvo', 'AC-003', 2024, 'Volvo', 'XC60', 'DEMO-03', 'SUV', 'empresa@alugacar.demo', 549, 'Híbrido', 'Branco', 'Espaço para novos planos', 'Contagem, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/2023_Volvo_XC60_T8_R-Line_front.jpg/960px-2023_Volvo_XC60_T8_R-Line_front.jpg'),
    ('bmw', 'AC-004', 2023, 'BMW', '320i', 'DEMO-04', 'Sedan', 'empresa@alugacar.demo', 389, 'Gasolina', 'Laranja', 'O prazer de dirigir', 'Belo Horizonte, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg/960px-BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg'),
    ('volvo2', 'AC-005', 2025, 'Volvo', 'XC60 Plus', 'DEMO-05', 'SUV', 'empresa@alugacar.demo', 599, 'Híbrido', 'Branco', 'Para ir um pouco além', 'Contagem, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg/960px-Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg'),
    ('mercedes2', 'AC-006', 2025, 'Mercedes-Benz', 'C 200 Exclusive', 'DEMO-06', 'Premium', 'empresa@alugacar.demo', 489, 'Híbrido', 'Prata', 'Sua viagem merece', 'Betim, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg'),
    ('demo-taycan', 'AC-019', 2024, 'Porsche', 'Taycan', 'DEMO-19', 'Elétrico', 'rotaminas@alugacar.demo', 799, 'Elétrico', null, 'Elétrico', 'Belo Horizonte, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Porsche_Taycan_%282024%29_%2854731488492%29.jpg/960px-Porsche_Taycan_%282024%29_%2854731488492%29.jpg'),
    ('demo-macan-gts', 'AC-020', 2023, 'Porsche', 'Macan GTS', 'DEMO-20', 'SUV', 'rotaminas@alugacar.demo', 679, 'Gasolina', null, 'SUV', 'Divinópolis, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/The_frontview_of_Porsche_Macan_GTS_%2895B%29.jpg/960px-The_frontview_of_Porsche_Macan_GTS_%2895B%29.jpg'),
    ('demo-bmw-x3', 'AC-021', 2023, 'BMW', 'X3 xDrive30i', 'DEMO-21', 'SUV', 'rotaminas@alugacar.demo', 449, 'Gasolina', null, 'SUV', 'Sete Lagoas, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/BMW_X3_xDrive30i_%28G01%2C_2023%29_%2853584158370%29.jpg/960px-BMW_X3_xDrive30i_%28G01%2C_2023%29_%2853584158370%29.jpg'),
    ('demo-bmw-i4', 'AC-022', 2024, 'BMW', 'i4 eDrive40', 'DEMO-22', 'Elétrico', 'rotaminas@alugacar.demo', 529, 'Elétrico', null, 'Elétrico', 'Betim, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/BMW_i4_eDrive40_M_Sport_%28G26%29_front.jpg/960px-BMW_i4_eDrive40_M_Sport_%28G26%29_front.jpg'),
    ('demo-mercedes-glc', 'AC-023', 2024, 'Mercedes-Benz', 'GLC 300 4MATIC', 'DEMO-23', 'SUV', 'rotaminas@alugacar.demo', 525, 'Híbrido', null, 'SUV', 'Divinópolis, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/2024_Mercedes-Benz_GLC_300_4MATIC_%28hire_car%29_front.jpg/960px-2024_Mercedes-Benz_GLC_300_4MATIC_%28hire_car%29_front.jpg'),
    ('demo-volvo-ex30', 'AC-024', 2025, 'Volvo', 'EX30', 'DEMO-24', 'Elétrico', 'viaverde@alugacar.demo', 339, 'Elétrico', null, 'Elétrico', 'Nova Lima, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/2025_Volvo_EX30%2C_front_left_4.11.25.jpg/960px-2025_Volvo_EX30%2C_front_left_4.11.25.jpg'),
    ('demo-mitsubishi-triton', 'AC-025', 2024, 'Mitsubishi', 'L200 Triton', 'DEMO-25', 'Picape', 'viaverde@alugacar.demo', 369, 'Diesel', null, 'Picape', 'Sete Lagoas, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/PIMS_2024_-_Mitsubishi_Triton_Athlete_4WD_%28front%29.jpg/330px-PIMS_2024_-_Mitsubishi_Triton_Athlete_4WD_%28front%29.jpg'),
    ('demo-mitsubishi-outlander', 'AC-026', 2024, 'Mitsubishi', 'Outlander PHEV', 'DEMO-26', 'SUV', 'viaverde@alugacar.demo', 399, 'Híbrido', null, 'SUV', 'Nova Lima, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Mitsubishi_OUTLANDER_PHEV_P_Executive_Package_%285LA-GN0W-XDUHZ%29_front.jpg/960px-Mitsubishi_OUTLANDER_PHEV_P_Executive_Package_%285LA-GN0W-XDUHZ%29_front.jpg'),
    ('demo-mitsubishi-eclipse', 'AC-027', 2022, 'Mitsubishi', 'Eclipse Cross', 'DEMO-27', 'SUV', 'viaverde@alugacar.demo', 289, 'Gasolina', null, 'SUV', 'Belo Horizonte, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/2022_Mitsubishi_Eclipse_Cross_LE_S-AWC%2C_front_left%2C_09-10-2022.jpg/330px-2022_Mitsubishi_Eclipse_Cross_LE_S-AWC%2C_front_left%2C_09-10-2022.jpg'),
    ('demo-mitsubishi-mirage', 'AC-028', 2024, 'Mitsubishi', 'Mirage', 'DEMO-28', 'Hatch', 'viaverde@alugacar.demo', 139, 'Gasolina', 'Vermelho', 'Hatch', 'Divinópolis, MG',
     'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2024_Mitsubishi_Mirage_1.2_GLX_in_Red_Metallic%2C_front_right%2C_07-04-2024.jpg/960px-2024_Mitsubishi_Mirage_1.2_GLX_in_Red_Metallic%2C_front_right%2C_07-04-2024.jpg')
) as dados(codigo, matricula, ano, marca, modelo, placa, categoria, login, diaria,
           combustivel, cor, destaque, localidade, foto)
join agentes_demo d on d.login = dados.login and d.perfil = 'empresa'
join alugacar.usuarios u on u.login = d.login
join alugacar.empresas e on e.id = u.id
join alugacar.agentes a on a.id = e.id and a.cnpj = d.cnpj;

insert into alugacar.automoveis (
    id, codigo, matricula, ano, marca, modelo, placa, categoria, proprietario_id,
    diaria, combustivel, cor, foto, destaque, localidade
)
select gen_random_uuid(), codigo, matricula, ano, marca, modelo, placa, categoria,
       proprietario_id, diaria, combustivel, cor, foto, destaque, localidade
from frota_demo
on conflict do nothing;

-- Atualiza fotos e preenche localidades vazias dos veículos de teste já existentes.
update alugacar.automoveis a
set foto = d.foto, localidade = coalesce(a.localidade, d.localidade)
from frota_demo d
where a.codigo = d.codigo and a.placa = d.placa and a.matricula = d.matricula
  and a.proprietario_id = d.proprietario_id and a.marca = d.marca and a.modelo = d.modelo;

commit;

select marca, count(*) as veiculos_da_carga
from alugacar.automoveis
where codigo in ('porsche', 'mercedes', 'volvo', 'bmw', 'volvo2', 'mercedes2', 'demo-taycan', 'demo-macan-gts', 'demo-bmw-x3', 'demo-bmw-i4', 'demo-mercedes-glc', 'demo-volvo-ex30', 'demo-mitsubishi-triton', 'demo-mitsubishi-outlander', 'demo-mitsubishi-eclipse', 'demo-mitsubishi-mirage')
group by marca
order by marca;
