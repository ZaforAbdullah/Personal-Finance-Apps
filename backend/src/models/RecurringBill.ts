import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'recurring_bills',
  timestamps: true,
  underscored: true,
})
export class RecurringBill extends Model {
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare avatarUrl: string | null;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare category: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare dueDay: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
