import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'budgets',
  timestamps: true,
  underscored: true,
})
export class Budget extends Model {
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare category: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare maximum: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: '#277C78' })
  declare theme: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
