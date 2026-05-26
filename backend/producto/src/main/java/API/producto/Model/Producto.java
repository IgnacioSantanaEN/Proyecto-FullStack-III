package API.producto.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "nombre")
    private String name;
    @Column(name = "sku")
    private String sku;
    @Column(name = "categoria")
    private String categoria;
    @Column(name = "cantidad")
    private double stock;
    @Column(name = "estado")
    private String estado;
    @Column(name = "marca")
    private String marca;
    @Column(name = "precio")
    private double precio;
    @Column(name = "owner_id")
    private Integer ownerId;
}
